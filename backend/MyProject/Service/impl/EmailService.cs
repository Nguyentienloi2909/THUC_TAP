using Microsoft.Extensions.Options;
using MimeKit;
using MyProject.Utils;
using MailKit.Net.Smtp;
using MyProject.Service.interfac;
using MyProject.Dto;
using MyProject.Entity;
using Microsoft.EntityFrameworkCore;
using MyProject.Mappers;
using MyProject.Entity.Enum;

namespace MyProject.Service.impl
{
    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly EmailSettings _settings;
        public EmailService(ApplicationDbContext dbContext, IOptions<EmailSettings> settings)
        {
            _dbContext = dbContext;
            _settings = settings.Value;

        }
        public async Task SendEmailAsync(EmailRequest request)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = BuildHtmlEmail(request.Subject, request.Description)
            };

            if (!string.IsNullOrEmpty(request.AttachmentUrl))
            {
                using var httpClient = new HttpClient();
                var fileBytes = await httpClient.GetByteArrayAsync(request.AttachmentUrl);
                var fileName = Path.GetFileName(new Uri(request.AttachmentUrl).LocalPath);
                bodyBuilder.Attachments.Add(fileName, fileBytes);
            }

            email.Body = bodyBuilder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.SenderEmail, _settings.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }

        public async Task SendNotificationToUserAsync(UserDto user, Notification notification)
        {
            var request = new EmailRequest
            {
                To = user.Email,
                Subject = $"📢 {notification.Title}",
                Description = notification.Description
            };

            await SendEmailAsync(request);
        }

        public async Task SendNotificationToAllUsersAsync(int notificationId)
        {
            var notification = await _dbContext.Notifications.FindAsync(notificationId);
            if (notification == null) return;

            var users = await _dbContext.Users
                .Where(u => u.Status == Entity.Enum.StatusUser.Active) // Hoặc Enum nếu bạn dùng enum
                .ToListAsync();

            var emailTasks = users.Select(user =>
                SendNotificationToUserAsync(user.ToDto(), notification)
            );

            await Task.WhenAll(emailTasks);
        }

        public async Task SendTaskAssignmentEmailAsync(UserDto user, TaskItemDto task)
        {
            var fileInfo = !string.IsNullOrWhiteSpace(task.UrlFile)
            ? $"<strong>Document:</strong> <a href='{task.UrlFile}' target='_blank'>Tải về</a><br/>"
            : string.Empty;

            var request = new EmailRequest
            {
                To = user.Email,
                Subject = $"📝 Công việc mới: {task.Title}",
                Description = $@"
                    <strong>Mô tả:</strong> {task.Description}<br/>
                    <strong>Bắt đầu:</strong> {task.StartTime:dd/MM/yyyy HH:mm}<br/>
                    <strong>Kết thúc:</strong> {task.EndTime:dd/MM/yyyy HH:mm}<br/>
                    {fileInfo}
                    <strong>Người giao việc:</strong> {task.SenderName}<br/>
                    <strong>Trạng thái:</strong> {task.Status.ToString()}

                "
            };
            await SendEmailAsync(request);
        }


        public async Task SendSalaryEmailToUserAsync(UserDto user, SalaryDto dto, AttendanceSummaryDto attendance)
        {
           
            var request = new EmailRequest
            {
                To = user.Email,
                Subject = $"📝 TIỀN LƯƠNG THÁNG {dto.Month}/{dto.Year}",
                Description = $@"
                    <strong>Người nhận:</strong> {dto.UserFullName}<br/>
                    <strong>Tổng số ngày làm việc đúng giờ:</strong> {attendance.TotalPresentDays}<br/>
                    <strong>Tổng số ngày làm việc đi trễ:</strong> {attendance.TotalLateDays}<br/>
                    <strong>Tổng số ngày nghỉ phép:</strong> {attendance.TotalLeaveDays}<br/>
                    <strong>Tổng số ngày vắng:</strong> {attendance.TotalAbsentDays}<br/>
                    <strong>Tổng số giờ tăng ca:</strong> {attendance.TotalOvertimeHours}h<br/>
                    <strong>Lương cơ bản:</strong> {dto.MonthSalary?.ToString("N0")} VND<br/>
                    <strong>Khấu trừ:</strong> {((attendance.TotalLateDays + attendance.TotalAbsentDays) * 100000).ToString("N0")} VND<br/>
                    <strong>Tăng ca:</strong> {((decimal)attendance.TotalOvertimeHours * 1.5m * (dto.MonthSalary / attendance.TotalWorkingDays / 9m))?.ToString("N2")} VND<br/>
                    <strong>TỔNG TIỀN NHẬN ĐƯỢC:</strong> {dto.TotalSalary?.ToString("N0")} VND<br/>
                "
            };
            await SendEmailAsync(request);
        }

        public async Task SendSalaryToAllUsersAsync(int month, int year)
        {
            var salaries = await _dbContext.Salaries
                .Include(s => s.User)
                .Where(s => s.Month == month && s.Year == year && s.User.Status == StatusUser.Active)
                .ToListAsync();

            var emailTasks = salaries.Select(async salary =>
            {
                var userDto = salary.User.ToDto();
                var salaryDto = new SalaryDto
                {
                    UserFullName = salary.User.FullName,
                    MonthSalary = salary.MonthSalary,
                    TotalSalary = salary.TotalSalary,
                    Month = month,
                    Year = year
                };

                var attendance = await GetUserMonthlySummaryAsync(salary.User.Id, month, year);

                await SendSalaryEmailToUserAsync(userDto, salaryDto, attendance);
            });

            await Task.WhenAll(emailTasks);
        }

        private async Task<AttendanceSummaryDto> GetUserMonthlySummaryAsync(int userId, int month, int year)
        {
            var start = new DateTime(year, month, 1);
            var end = start.AddMonths(1).AddDays(-1);

            var attendances = await _dbContext.Attendances
                .Where(a => a.Workday >= start && a.Workday <= end)
                .ToListAsync();

            var userAttendances = attendances
                .Where(a => a.UserId == userId)
                .ToList();

            var totalDays = (end - start).Days + 1;
            var allDaysInMonth = Enumerable.Range(0, totalDays)
                .Select(i => start.AddDays(i).Date)
                .ToList();

            int presentDays = userAttendances.Count(a => a.Status == StatusAttendance.Present);
            int lateDays = userAttendances.Count(a => a.Status == StatusAttendance.Late);
            int leaveDays = userAttendances.Count(a => a.Status == StatusAttendance.Leave);
            double totalOvertime = userAttendances.Sum(a => a.Overtime ?? 0);

            int absentDays = 0;
            int totalWorkingDays = 0;

            foreach (var day in allDaysInMonth)
            {
                // Ngày làm việc nếu có bất kỳ ai có chấm công hợp lệ (check-in và check-out)
                bool isWorkingDay = attendances.Any(a =>
                    a.Workday.Date == day && a.CheckIn != null && a.CheckOut != null);

                if (isWorkingDay)
                {
                    totalWorkingDays++;

                    var userAttendanceOfDay = userAttendances.FirstOrDefault(a => a.Workday.Date == day);

                    if (userAttendanceOfDay == null || userAttendanceOfDay.Status == StatusAttendance.Absent)
                    {
                        absentDays++;
                    }
                }
            }

            return new AttendanceSummaryDto
            {
                TotalPresentDays = presentDays,
                TotalLateDays = lateDays,
                TotalLeaveDays = leaveDays,
                TotalAbsentDays = absentDays,
                TotalOvertimeHours = Math.Round(totalOvertime, 2),
                TotalWorkingDays = totalWorkingDays
            };
        }




        private string BuildHtmlEmail(string title, string content)
        {
            return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <style>
                    body {{
                        font-family: 'Segoe UI', sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }}
                    .container {{
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        max-width: 600px;
                        margin: auto;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }}
                    .header {{
                        font-size: 24px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin-bottom: 20px;
                    }}
                    .content {{
                        font-size: 16px;
                        color: #333;
                        line-height: 1.6;
                    }}
                    .footer {{
                        font-size: 12px;
                        color: #888;
                        margin-top: 30px;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>{title}</div>
                    <div class='content'>
                        {content}
                    </div>
                    <div class='footer'>
                        Email này được gửi từ hệ thống tự động. Vui lòng không trả lời.
                    </div>
                </div>
            </body>
            </html>
            ";
        }

    }
}
