namespace MyProject.Dto
{
    public class AttendanceDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public bool IsPresent { get; set; }
        public int UserId { get; set; }
    }

}
