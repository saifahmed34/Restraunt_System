using OrderService.Core.Entities;

namespace OrderService.Core.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(Guid id);
        Task<Order> GetOrderByPaymentIntentIdAsync(string paymentIntentId);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<Order> CreateOrderAsync(Order order);
        Task UpdateOrderAsync(Order order);
    }
}
