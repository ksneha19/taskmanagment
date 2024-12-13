//Task.cs
using System.Text.Json.Serialization; // Add this

namespace TaskManagementAPI.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }

        public int UserId { get; set; }  // Foreign key

        [JsonIgnore] // Prevent circular reference
        public User? User { get; set; }  // Navigation property
    }
}
