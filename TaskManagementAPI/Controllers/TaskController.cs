//TaskController.js

using Microsoft.AspNetCore.Mvc;
using TaskManagementAPI.Data;
using TaskManagementAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;


namespace TaskManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Task
        [HttpGet]
        public ActionResult<IEnumerable<TaskManagementAPI.Models.Task>> GetTasks()
{
    var tasks = _context.Tasks
                        .Include(t => t.User) // Eager load User
                        .ToList();
    return Ok(tasks);
}

        // GET: api/Task/5
        [HttpGet("{id}")]
        public ActionResult<TaskManagementAPI.Models.Task> GetTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        // POST: api/Task
        [HttpPost]
public ActionResult<TaskManagementAPI.Models.Task> CreateTask(TaskManagementAPI.Models.Task task)
{
    if (task.UserId <= 0)
    {
        return BadRequest("UserId is required.");
    }

    var user = _context.Users.Find(task.UserId);
    if (user == null)
    {
        return NotFound("User not found.");
    }

    task.User = user; // Associate the user explicitly
    _context.Tasks.Add(task);
    _context.SaveChanges();

    return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
}


        // PUT: api/Task/5
        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, [FromBody] TaskManagementAPI.Models.Task task) // Added [FromBody] to bind task object
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            _context.Entry(task).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Task/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
