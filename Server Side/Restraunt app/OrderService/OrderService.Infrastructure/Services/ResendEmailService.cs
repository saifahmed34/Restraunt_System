using OrderService.Core.Entities;
using OrderService.Core.Interfaces;
using Resend;
using Microsoft.Extensions.Logging;

namespace OrderService.Infrastructure.Services
{
    public class ResendEmailService : IEmailService
    {
        private readonly IResend _resend;
        private readonly ILogger<ResendEmailService> _logger;

        public ResendEmailService(IResend resend, ILogger<ResendEmailService> logger)
        {
            _resend = resend;
            _logger = logger;
        }

        public async Task SendOrderSuccessEmailAsync(Order order)
        {
            try
            {
                var message = new EmailMessage
                {
                    From = "[EMAIL_ADDRESS]", // You should configure this in appsettings
                    To = "[EMAIL_ADDRESS]",
                    Subject = $"Order Confirmation - {order.Id}",
                    HtmlBody = $"<h1>Thank you for your order!</h1><p>Your order (ID: {order.Id}) has been paid successfully.</p><p>Total Amount: ${order.TotalAmount:0.00}</p>"
                };

                await _resend.EmailSendAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send success email.");
            }
        }
    }
}
