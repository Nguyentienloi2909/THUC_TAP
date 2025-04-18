namespace MyProject.Dto
{ 
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public decimal BasicSalary { get; set; }
        public double SalaryFactor { get; set; }
        public string Status { get; set; }
        public int RoleId { get; set; }
        public string? RoleName { get; set; }  // Chỉ cần tên của role
        public int? GroupId { get; set; }
        public string? GroupName { get; set; }  // Chỉ cần tên của nhóm
        public ICollection<AttendanceDto> Attendances { get; set; } = new List<AttendanceDto>();
        public ICollection<SalaryDto> Salaries { get; set; } = new List<SalaryDto>();
        public ICollection<TaskItemDto> Tasks { get; set; } = new List<TaskItemDto>();
        public ICollection<MessageDto> SentMessages { get; set; } = new List<MessageDto>();
        public ICollection<MessageDto> ReceivedMessages { get; set; } = new List<MessageDto>();
    }


    
}
