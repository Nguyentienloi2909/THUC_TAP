namespace MyProject.Entity
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.Now;
    }
}
