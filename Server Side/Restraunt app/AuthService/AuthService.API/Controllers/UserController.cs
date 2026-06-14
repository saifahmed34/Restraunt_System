using AuthService.Application.Dtos;
using AuthService.Infrastructure;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AuthService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthDbContext _UserdbContext;
        public UserController(AuthDbContext UserDbContext)
        {
            _UserdbContext = UserDbContext;
        }

        [Authorize]
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _UserdbContext.Users
                .Where(u => u.Id == id)
                .ProjectToType<UserDto>()
                .FirstOrDefaultAsync();

            if (user == null) return NotFound("User not found");

            return Ok(user);
        }


        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                              ?? User.FindFirst("nameid");

            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            var userId = Guid.Parse(userIdClaim.Value);

            var user = await _UserdbContext.Users
                .Where(u => u.Id == userId)
                .ProjectToType<UserDto>()
                .FirstOrDefaultAsync();

            if (user == null) return NotFound("User not found");

            return Ok(user);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto request)
        {
            // extract user id from token
            var userId = User.FindFirst("sub")?.Value
                      ?? User.FindFirst("id")?.Value
                      ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userId, out var guid))
                return Unauthorized("Invalid token");


            var user = await _UserdbContext.Users.FindAsync(guid);
            if (user == null)
                return NotFound("User not found");

            // --- Update fields ---
            if (!string.IsNullOrWhiteSpace(request.Name))
                user.Name = request.Name;

            if (!string.IsNullOrWhiteSpace(request.Email))
                user.Email = request.Email;

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
                user.PhoneNumber = request.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(request.Address))
                user.address = request.Address;

            await _UserdbContext.SaveChangesAsync();

            return Ok(user.Adapt<UserDto>());
        }

    }
}
