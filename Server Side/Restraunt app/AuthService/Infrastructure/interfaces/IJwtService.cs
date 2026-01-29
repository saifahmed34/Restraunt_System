using AuthService.Core.Entities;

namespace AuthService.Infrastructure.interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
