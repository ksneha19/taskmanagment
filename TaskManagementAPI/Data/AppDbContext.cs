//AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Models;

namespace TaskManagementAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }  // DbSet for Users
        public DbSet<TaskManagementAPI.Models.Task> Tasks { get; set; } // Fully qualified Task namespace

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the relationship between User and Task
            modelBuilder.Entity<TaskManagementAPI.Models.Task>()  // Fully qualify Task here too
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId);
        }
    }
}
