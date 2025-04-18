namespace MyProject.Dto
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public int SenderId { get; set; }
        public string SenderUsername { get; set; }  // Chỉ cần tên người gửi
        public int ReceiverId { get; set; }
        public string ReceiverUsername { get; set; }
    }
}
