using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Domain.Entities; // Assume your ApplicationUser model is here
using UserService.API.Configurations;
using UserService.Infrastructure.Persistence; // Assume your DbContext is here

namespace UserService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationUserController : ControllerBase
    {
        private readonly UserServiceDbContext _context;

        public ApplicationUserController(UserServiceDbContext context)
        {
            _context = context;
        }

        // GET: api/ApplicationUser
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAllUsers()
        {
            return await _context.ApplicationUsers.ToListAsync();
        }

        // GET: api/ApplicationUser/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUser>> GetUserById(Guid id)
        {
            var user = await _context.ApplicationUsers.FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        // PUT: api/ApplicationUser/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, ApplicationUser updatedUser)
        {
            if (!Equals(id, updatedUser.Id))
                return BadRequest("ID mismatch.");

            var existingUser = await _context.ApplicationUsers.FindAsync(id);

            if (existingUser == null)
                return NotFound();

            // Manually update fields (example)
            // existingUser.FirstName = updatedUser.FirstName;
            // existingUser.LastName = updatedUser.LastName;
            // existingUser.Email = updatedUser.Email;
            // Add other fields you want to allow updating

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "A concurrency error occurred while updating the user.");
            }

            return NoContent();
        }


        // DELETE: api/ApplicationUser/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.ApplicationUsers.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.ApplicationUsers.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
