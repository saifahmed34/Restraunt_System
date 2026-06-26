using OrderService.Core.Entities;

namespace OrderService.Core.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateCheckoutSessionAsync(Order order, string successUrl, string cancelUrl);
    }
}
