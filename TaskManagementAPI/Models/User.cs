//User.cs
using System.Text.Json.Serialization; // Add this

namespace TaskManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        [JsonIgnore] // Prevent circular reference if necessary
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}
