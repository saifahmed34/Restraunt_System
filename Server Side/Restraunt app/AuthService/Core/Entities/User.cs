using System.ComponentModel.DataAnnotations;

namespace AuthService.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        // public required string ConfirmPassword { get; set; }
        public string Roles { get; set; } = "Customer";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? address { get; set; }
        public string PhoneNumber { get; set; }

    }
}
