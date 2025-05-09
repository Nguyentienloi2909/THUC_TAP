using Microsoft.EntityFrameworkCore;
using MyProject.Dto;
using MyProject.Entity;
using MyProject.Entity.Enum;
using MyProject.Service.interfac;
using MyProject.Utils;

namespace MyProject.Service.impl
{
    public class SalaryService : ISalaryService
    {
        private readonly ApplicationDbContext _dbContext;
        public SalaryService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<SalaryDto>> CalculateAllUserSalaries(int month, int year, decimal tienPhat = 100000)
        {
            var users = await _dbContext.Users
                .Where(u => u.Status == StatusUser.Active)  
                .Select(u => u.Id)                
                .ToListAsync();                   


            var salaryDtos = new List<SalaryDto>();

            foreach (var userId in users)
            {
                try
                {
                    var salaryDto = await CalculateSalaryByUserId(userId, month, year, tienPhat);
                    if (salaryDto != null)
                        salaryDtos.Add(salaryDto);
                }
                catch (Exception ex)
                {
                    salaryDtos.Add(new SalaryDto
                    {
                        UserId = userId,
                        Month = month,
                        Year = year,
                        Note = $"Error calculating salary: {ex.Message}"
                    });
                }
            }

            return salaryDtos;
        }

        public async Task<SalaryDto?> CalculateSalaryByUserId(int userId, int monthDto, int yearDto, decimal tienPhat = 100000)
        {
            var now = DateTime.Now;
            int month = monthDto != 0 ? monthDto:now.Month;
            int year = yearDto != 0 ? yearDto: now.Year;
            int totalWorkingDaysInMonth = await GetTotalWorkingDaysInMonth(month, year);
            // Lấy danh sách Attendance trong tháng và năm
            var attendances = await _dbContext.Attendances
                .Where(a => a.UserId == userId &&
                            a.Workday.Month == month &&
                            a.Workday.Year == year
                      )
                .ToListAsync();

            var salary = await _dbContext.Salaries
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Month == month && s.Year == year && s.Display==true);

            if ((attendances == null || !attendances.Any()) && salary == null)
            {
                return null;
            }
            if (salary == null)
            {
                // Có điểm danh nhưng chưa có salary => tạo mới
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                salary = new Salary
                {
                    UserId = userId,
                    Month = month,
                    Year = year,
                    NumberOfWorkingDays = 0,
                    TotalSalary = 0,
                    MonthSalary = user?.MonthSalary ?? 0,
                };
                _dbContext.Salaries.Add(salary);
                await _dbContext.SaveChangesAsync();
            }

            int validWorkDays = 0;
            int lateCount = 0;
            int absentCount = 0;
            double? overTime = 0;

            // Duyệt qua tất cả các bản ghi Attendance để phân loại
            foreach (var attendance in attendances)
            {
                overTime += attendance.Overtime;
                switch (attendance.Status)
                {
                    case StatusAttendance.Present:
                        validWorkDays++;
                        break;
                    case StatusAttendance.Late:
                        validWorkDays++;
                        lateCount++;
                        break;
                    case StatusAttendance.Pending:
                        break;
                    case StatusAttendance.Absent:
                        absentCount++;
                        break;
                    case StatusAttendance.Leave:
                        break;
                }
            }
            
            if (salary.MonthSalary.HasValue && totalWorkingDaysInMonth > 20)
            {
                decimal rawSalary = salary.MonthSalary.Value / totalWorkingDaysInMonth *
                                    validWorkDays ;
                decimal penalty = CalculatePenalty(lateCount, absentCount, tienPhat);
                decimal finalSalary = rawSalary - penalty;

                if (finalSalary < 0) finalSalary = 0;
                salary.NumberOfWorkingDays = validWorkDays;
                salary.TotalSalary = (decimal)Math.Round(finalSalary, 2);
                salary.Note = $"Trễ: {lateCount}, Vắng: {absentCount}, Số tiền trừ: {penalty:N0}";

            }
            else
            {
                salary.NumberOfWorkingDays = validWorkDays;
                salary.TotalSalary = 0;
                salary.Note = $"Tiền lương đang được điều chỉnh";
            }
            
            await _dbContext.SaveChangesAsync();
            var result = Mappers.MapperToDto.ToDto(salary);
            result.UserFullName = (await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId)).FullName;
            return result;
        }

        public async Task<List<SalaryDto>> CalculateSalariesByQuarter(int year, int quarter)
        {
            // Duyệt qua các tháng trong quý
            int startMonth = (quarter - 1) * 3 + 1;
            int endMonth = startMonth + 2;

            var salaryDtos = new List<SalaryDto>();

            // Tính lương cho từng tháng trong quý
            for (int month = startMonth; month <= endMonth; month++)
            {
                var salaries = await CalculateAllUserSalaries(month, year);
                salaryDtos.AddRange(salaries);
            }

            return salaryDtos;
        }

        public async Task<List<SalaryDto>> CalculateSalariesByYear(int year)
        {
            var salaryDtos = new List<SalaryDto>();

            // Tính lương cho từng tháng trong năm
            for (int month = 1; month <= 12; month++)
            {
                var salaries = await CalculateAllUserSalaries(month, year);
                salaryDtos.AddRange(salaries);
            }

            return salaryDtos;
        }

        // Phương thức tính phạt
        private decimal CalculatePenalty(int lateCount, int absentCount, decimal tienPhat)
        {
            decimal penalty = (lateCount + absentCount ) * tienPhat;
            return penalty;
        }

        // Phương thức tính tổng số ngày làm việc trong tháng (dựa vào việc có ít nhất một user check-in)
        private async Task<int> GetTotalWorkingDaysInMonth(int month, int year)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            int workingDaysCount = 0;

            // Duyệt qua tất cả các ngày trong tháng
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                // Kiểm tra xem có ít nhất một nhân viên check-in vào ngày này hay không
                var isWorkingDay = await _dbContext.Attendances
                    .AnyAsync(a => a.Workday.Date == date.Date &&
                                   (a.Status == StatusAttendance.Present || a.Status == StatusAttendance.Late),
                               CancellationToken.None);

                if (isWorkingDay)
                {
                    workingDaysCount++;
                }
            }

            return workingDaysCount;
        }


    }
}
