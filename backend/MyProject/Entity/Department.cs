namespace MyProject.Entity
{
    public class Department
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; } = null!;

        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
