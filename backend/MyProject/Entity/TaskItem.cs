using MyProject.Entity.Enum;

namespace MyProject.Entity
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public DateTime WeekStart { get; set; } // Ngày bắt đầu tuần
        public StatusTask Status { get; set; } = StatusTask.Pending;

        public int? AssignedToId { get; set;}
        public User AssignedTo { get; set; } = null!;
    }
}
