using OrderService.Application.DTOs;

namespace OrderService.Application.Interfaces
{
    public interface IOrderManagerService
    {
        Task<string> CreateOrderCheckoutSessionAsync(string userId, string userEmail, CreateOrderDto dto);
        Task HandlePaymentSuccessAsync(string paymentIntentId);
    }
}
