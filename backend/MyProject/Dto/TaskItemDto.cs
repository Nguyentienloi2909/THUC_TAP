namespace MyProject.Dto
{
    public class TaskItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime WeekStart { get; set; }
        public string Status { get; set; }  // Pending, InProgress, Completed, etc.
        public int AssignedToId { get; set; }
        public string AssignedToUsername { get; set; }
    }
}
