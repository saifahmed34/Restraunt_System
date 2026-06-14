using AuthService.Core.Entities;

namespace AuthService.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
