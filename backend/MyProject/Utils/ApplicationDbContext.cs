using Microsoft.EntityFrameworkCore;
using MyProject.Entity;

namespace MyProject.Utils
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        // DbSets cho các Entity
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Salary> Salaries { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình quan hệ Department - Group (1 -> N)
            modelBuilder.Entity<Department>()
                .HasMany(d => d.Groups)
                .WithOne(g => g.Department)
                .HasForeignKey(g => g.DepartmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ Group - User (1 -> N)
            modelBuilder.Entity<Group>()
                .HasMany(g => g.Users)
                .WithOne(u => u.Group)
                .HasForeignKey(u => u.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ User - Role (N -> 1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict); // Giới hạn xóa

            // Cấu hình quan hệ User - Attendance (1 -> N)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Attendances)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ User - Salary (1 -> N)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Salaries)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ User - TaskItem (1 -> N)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Tasks)
                .WithOne(t => t.AssignedTo)
                .HasForeignKey(t => t.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull); // Giữ lại TaskItem khi xóa User

            // Cấu hình quan hệ Message - User (N -> 1 cho Sender)
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict); // Giới hạn xóa

            // Cấu hình quan hệ Message - User (N -> 1 cho Receiver)
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict); // Giới hạn xóa

            modelBuilder.Entity<User>()
               .HasMany(u => u.Salaries) // Mối quan hệ giữa User và Salary
               .WithOne(s => s.User) // Mỗi Salary thuộc về một User
               .HasForeignKey(s => s.UserId) // Khóa ngoại UserId
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
