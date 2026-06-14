using AuthService.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Infrastructure
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
