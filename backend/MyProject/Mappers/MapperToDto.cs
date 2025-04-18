using MyProject.Dto;
using MyProject.Entity;

namespace MyProject.Mappers
{
    public static class MapperToDto
    {
        // User -> UserDto
        public static UserDto ToDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                BasicSalary = user.BasicSalary,
                SalaryFactor = user.SalaryFactor,
                Status = user.Status,
                RoleId = user.RoleId,
                RoleName = user.Role?.Name ?? string.Empty,
                GroupId = user.GroupId,
                GroupName = user.Group?.Name,

                Attendances = user.Attendances.Select(a => a.ToDto()).ToList(),
                Salaries = user.Salaries.Select(s => s.ToDto()).ToList(),
                Tasks = user.Tasks.Select(t => t.ToDto()).ToList(),
                SentMessages = user.SentMessages.Select(m => m.ToDto()).ToList(),
                ReceivedMessages = user.ReceivedMessages.Select(m => m.ToDto()).ToList()
            };
        }

        // Attendance -> AttendanceDto
        public static AttendanceDto ToDto(this Attendance attendance)
        {
            return new AttendanceDto
            {
                Id = attendance.Id,
                Date = attendance.Date,
                IsPresent = attendance.IsPresent,
                UserId = attendance.UserId
            };
        }

        // Salary -> SalaryDto
        public static SalaryDto ToDto(this Salary salary)
        {
            return new SalaryDto
            {
                Id = salary.Id,
                Month = salary.Month,
                Year = salary.Year,
                WorkDays = salary.WorkDays,
                TotalSalary = salary.TotalSalary,
                Note = salary.Note,
                UserId = salary.UserId,
                UserUsername = salary.User?.Username ?? string.Empty
            };
        }

        // TaskItem -> TaskItemDTO
        public static TaskItemDto ToDto(this TaskItem task)
        {
            return new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                WeekStart = task.WeekStart,
                Status = task.Status.ToString(),
                AssignedToId = task.AssignedToId ?? 0,
                AssignedToUsername = task.AssignedTo?.Username ?? string.Empty
            };
        }

        // Message -> MessageDto
        public static MessageDto ToDto(this Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                SentAt = message.SentAt,
                SenderId = message.SenderId,
                SenderUsername = message.Sender?.Username ?? string.Empty,
                ReceiverId = message.ReceiverId,
                ReceiverUsername = message.Receiver?.Username ?? string.Empty
            };
        }

        // Role -> RoleDto
        public static RoleDto ToDto(this Role role)
        {
            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name
            };
        }

        // Department -> DepartmentDto
        public static DepartmentDto ToDto(this Department department)
        {
            return new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Groups = department.Groups.Select(g => g.ToDto()).ToList()
            };
        }

        // Group -> GroupDto
        public static GroupDto ToDto(this Group group)
        {
            return new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                DepartmentId = group.DepartmentId,
                DepartmentName = group.Department?.Name ?? string.Empty,
                Users = group.Users.Select(u => u.ToDto()).ToList()
            };
        }
    }

}
