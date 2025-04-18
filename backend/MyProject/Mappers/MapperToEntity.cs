using MyProject.Dto;
using MyProject.Entity.Enum;
using MyProject.Entity;

namespace MyProject.Mappers
{
    public static class MapperToEntity
    {
        // UserDto -> User
        public static User ToEntity(this UserDto dto)
        {
            return new User
            {
                Id = dto.Id,
                Username = dto.Username,
                PasswordHash = string.Empty,
                PhoneNumber = dto.PhoneNumber,
                BasicSalary = dto.BasicSalary,
                SalaryFactor = dto.SalaryFactor,
                Status = dto.Status,
                RoleId = dto.RoleId,
                GroupId = dto.GroupId,
                // Không set các navigation như Role, Group ở đây (xử lý riêng khi cần)
            };
        }

        // AttendanceDto -> Attendance
        public static Attendance ToEntity(this AttendanceDto dto)
        {
            return new Attendance
            {
                Id = dto.Id,
                Date = dto.Date,
                IsPresent = dto.IsPresent,
                UserId = dto.UserId
            };
        }

        // SalaryDto -> Salary
        public static Salary ToEntity(this SalaryDto dto)
        {
            return new Salary
            {
                Id = dto.Id,
                Month = dto.Month,
                Year = dto.Year,
                WorkDays = dto.WorkDays,
                TotalSalary = dto.TotalSalary,
                Note = dto.Note,
                UserId = dto.UserId
            };
        }

        // TaskItemDTO -> TaskItem
        public static TaskItem ToEntity(this TaskItemDto dto)
        {
            return new TaskItem
            {
                Id = dto.Id,
                Title = dto.Title,
                Description = dto.Description,
                WeekStart = dto.WeekStart,
                Status = Enum.TryParse<StatusTask>(dto.Status, out var status) ? status : StatusTask.Pending,
                AssignedToId = dto.AssignedToId
            };
        }

        // MessageDto -> Message
        public static Message ToEntity(this MessageDto dto)
        {
            return new Message
            {
                Id = dto.Id,
                Content = dto.Content,
                SentAt = dto.SentAt,
                SenderId = dto.SenderId,
                ReceiverId = dto.ReceiverId
            };
        }

        // RoleDto -> Role
        public static Role ToEntity(this RoleDto dto)
        {
            return new Role
            {
                Id = dto.Id,
                Name = dto.Name
            };
        }

        // DepartmentDto -> Department
        public static Department ToEntity(this DepartmentDto dto)
        {
            return new Department
            {
                Id = dto.Id,
                Name = dto.Name
                // Không gán Groups trực tiếp, xử lý riêng
            };
        }

        // GroupDto -> Group
        public static Group ToEntity(this GroupDto dto)
        {
            return new Group
            {
                Id = dto.Id,
                Name = dto.Name,
                DepartmentId = dto.DepartmentId
                // Không set Department hoặc Users ở đây
            };
        }
    }
}
