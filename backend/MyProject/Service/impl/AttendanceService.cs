using Microsoft.EntityFrameworkCore;
using MyProject.Dto;
using MyProject.Entity;
using MyProject.Entity.Enum;
using MyProject.Mappers;
using MyProject.Service.interfac;
using MyProject.Utils;

namespace MyProject.Service.impl
{
    public class AttendanceService : IAttendanceService
    {
        private readonly ApplicationDbContext _dbContext;
        public AttendanceService(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public async Task<(bool IsSuccess, string? ErrorMessage)> CheckIn(int userId)
        {
            var now = DateTime.Now;
            var today = now.Date;

            var attendance = await _dbContext.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Workday == today);

            var user = await _dbContext.Users
                .FirstOrDefaultAsync(e => e.Id == userId && e.Status == StatusUser.Active);


            if (attendance == null)
            {
                if (user == null)
                    return (false , "người dùng không tìm thấy");
                else
                {
                    attendance = new Attendance
                    {
                        UserId = userId,
                        Workday = today,
                        Status = StatusAttendance.Pending
                    };
                    _dbContext.Attendances.Add(attendance);
                }
            }
            // Kiểm tra nếu đã quá 10h sáng
            var cutoffTime = today.AddHours(10); // 10:00 AM hôm nay
            if (now > cutoffTime)
                return (false, "Bạn đã quá giờ check-in cho phép (trễ sau 10h sáng)");

            attendance.CheckIn = DateTime.Now;

            var lateThreshold = today.AddHours(8).AddMinutes(10); // 08:10 AM
            attendance.Status = now > lateThreshold
                ? StatusAttendance.Late
                : StatusAttendance.Present;

            await _dbContext.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool IsSuccess, string? ErrorMessage)> CheckOut(int userId)
        {
            var today = DateTime.Now.Date;

            var attendance = await _dbContext.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Workday == today && a.CheckOut == null);

            if (attendance == null || attendance.CheckIn == null)
                return (false, "bạn chưa checkIn");

            var now = DateTime.Now;
            attendance.CheckOut = now;

            // Giờ kết thúc hành chính: 17h (5PM)
            var endOfWorkday = attendance.Workday.AddHours(17); 
            var earlyCheckoutThreshold = today.AddHours(16).AddMinutes(50); 
            if (now < earlyCheckoutThreshold)
            {
                attendance.Status = StatusAttendance.Late;
            }

            // Tính toán thời gian làm thêm
            if (attendance.CheckOut > endOfWorkday)
            {
                var overtimeMinutes = (attendance.CheckOut.Value - endOfWorkday).TotalMinutes;

                attendance.Overtime = overtimeMinutes >= 30
                    ? Math.Round(overtimeMinutes / 60.0, 2) // Đổi phút sang giờ, làm tròn đến 2 chữ số thập phân
                    : 0;
            }
            else
            {
                attendance.Overtime = 0;
            }

            var cutoffTime = today.AddHours(20); // 20:00 AM hôm nay
            if (now > cutoffTime)
                return (false, "Bạn đã quá giờ check-out cho phép");

            await _dbContext.SaveChangesAsync();
            return (true, null);
        }

        public async Task<List<AttendanceDto>> GetAllAttendancesForToday()
        {
            var today = DateTime.Now.Date;
            var attendances = await _dbContext.Attendances
                .Where(a => a.Workday == today)
                .Include(a => a.User)
                .ToListAsync();
            var attendanceDtos = attendances.ToDto();

            return attendanceDtos;
        }

        public async Task<List<AttendanceDto>> GetAttendanceByUserIdInMonthAsync(int userId, int month, int year)
        {
            var firstDayOfMonth = new DateTime(year, month, 1);
            var firstDayOfNextMonth = firstDayOfMonth.AddMonths(1);

            var attendances = await _dbContext.Attendances
                .Include(a => a.User)
                .Where(a => a.UserId == userId && a.Workday >= firstDayOfMonth && a.Workday < firstDayOfNextMonth)
                .ToListAsync();

            return attendances.Select(Mappers.MapperToDto.ToDto).ToList();
        }


        public async Task<(bool IsSuccess, string? ErrorMessage)> UpdateStatus(int userId, string status, string note = "")
        {
            var today = DateTime.UtcNow.Date;

            var attendance = await _dbContext.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Workday == today);

            if (attendance == null)
                return (false, "Không tìm thấy bản ghi điểm danh cho hôm nay");

            // Chuyển chuỗi status sang enum
            if (!Enum.TryParse<StatusAttendance>(status, true, out var parsedStatus))
                return (false, "Trạng thái không hợp lệ");

            attendance.Status = parsedStatus;
            attendance.Note = note;

            await _dbContext.SaveChangesAsync();
            return (true, null);
        }


    }
}
