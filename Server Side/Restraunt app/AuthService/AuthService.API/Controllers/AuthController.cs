using AuthService.Application.Dtos;
using AuthService.Core.Entities;
using AuthService.Infrastructure;
using AuthService.Application.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthController(AuthDbContext dbContext, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        // ---------------- REGISTER ----------------
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDtos request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if passwords match
            if (request.Password != request.ConfirmPassword)
                return BadRequest("Passwords do not match");

            if (await _dbContext.Users.AnyAsync(x => x.Email == request.Email))
                return BadRequest("Email already exists");

            // Map Name and Email automatically
            var user = request.Adapt<User>();

            // Handle Id and Password manually
            user.Id = Guid.NewGuid();
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok("User registered successfully");
        }


        // ---------------- LOGIN ----------------
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            // Find user by email
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user == null)
                return Unauthorized("Invalid email or password");

            // Verify hashed password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return Unauthorized("Invalid email or password");

            // Generate JWT token
            var token = _jwtService.GenerateToken(user);

            // Map User entity to UserDto using Mapster
            var userDto = user.Adapt<UserDto>();

            // Return token and user info
            return Ok(new
            {
                Token = token,
                User = userDto
            });
        }
        // ----------------Delete User ----------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("users/del/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound("User not found.");

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();

            return Ok("User deleted successfully.");
        }



        //change password//



        // ---------------- SECURE GET USERS ----------------
        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _dbContext.Users
                .ProjectToType<UserDto>()
                .ToListAsync();

            return Ok(users);
        }


    }
}
