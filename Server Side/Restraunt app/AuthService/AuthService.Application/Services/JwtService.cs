using AuthService.Core.Entities;
using AuthService.Infrastructure.interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthService.Application.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;
        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user)
        {
            // Secret key must be at least 32 characters (256 bits)
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name ?? user.Email)
            };

            // If Roles is a comma-separated string (e.g. "Admin,User"), emit one role claim per role
            if (!string.IsNullOrWhiteSpace(user.Roles))
            {
                foreach (var role in user.Roles.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Trim()));
                }
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}