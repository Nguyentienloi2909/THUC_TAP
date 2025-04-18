using System.Data;
using System.Text.RegularExpressions;

namespace MyProject.Entity
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public decimal BasicSalary { get; set; }
        public double SalaryFactor { get; set; } = 1.0;
        public string Status { get; set; } = "Active"; // Hoặc enum

        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        public int? GroupId { get; set; }
        public Group? Group { get; set; }

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<Salary> Salaries { get; set; } = new List<Salary>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    }
}
