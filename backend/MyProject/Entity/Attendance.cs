namespace MyProject.Entity
{
    public class Attendance
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public bool IsPresent { get; set; }

        // Thuộc tính khóa ngoại UserId
        public int UserId { get; set; }

        // Thuộc tính điều hướng tới User (đảm bảo đúng kiểu dữ liệu)
        public User User { get; set; } = null!;
    }


}
