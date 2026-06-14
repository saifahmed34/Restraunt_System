namespace AuthService.Application.Dtos
{
    public sealed record RegisterDtos(string Name, string Email, string Password, string ConfirmPassword, string address, string PhoneNumber);

}
