//UserController.js

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
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
{
    var users = _context.Users
                        .Include(u => u.Tasks) // Include tasks for all users
                        .ToList();
    return Ok(users);
}

        // GET: api/User/5
        [HttpGet("{id}")]
public ActionResult<User> GetUser(int id)
{
    var user = _context.Users.Include(u => u.Tasks).FirstOrDefault(u => u.Id == id);
    if (user == null)
    {
        return NotFound();
    }
    return Ok(user);
}


        // POST: api/User
        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] User user) // Added [FromBody] to bind user object
        {
            _context.Users.Add(user);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user) // Added [FromBody] to bind user object
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
