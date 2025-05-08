namespace MyProject.Entity
{
    public class Message
    {
        public int Id { get; set; }
        public string? Content { get; set; }
        public string? UrlContent { get; set; }
        public DateTime SentAt { get; set; }

        public int? SenderId { get; set; }
        public User Sender { get; set; } = null!;
        public int? ReceiverId { get; set; }
        public User Receiver { get; set; } = null!;
    }

}
