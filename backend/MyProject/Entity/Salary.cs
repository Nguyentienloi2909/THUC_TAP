namespace MyProject.Entity
{
    public class Salary
    {
        public int Id { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int WorkDays { get; set; }
        public decimal TotalSalary { get; set; }
        public string Note { get; set; } = string.Empty;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }

}
