using OrderService.Core.Entities;

namespace OrderService.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendOrderSuccessEmailAsync(Order order);
    }
}
