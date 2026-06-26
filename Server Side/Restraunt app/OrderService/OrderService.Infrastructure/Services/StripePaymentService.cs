using Microsoft.Extensions.Configuration;
using OrderService.Core.Entities;
using OrderService.Core.Interfaces;
using Stripe.Checkout;

namespace OrderService.Infrastructure.Services
{
    public class StripePaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;

        public StripePaymentService(IConfiguration configuration)
        {
            _configuration = configuration;
            Stripe.StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        public async Task<string> CreateCheckoutSessionAsync(Order order, string successUrl, string cancelUrl)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = order.OrderItems.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmountDecimal = item.UnitPrice * 100, // Stripe uses cents
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.MenuItemName,
                        },
                    },
                    Quantity = item.Quantity,
                }).ToList(),
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,
                ClientReferenceId = order.Id.ToString(),
                CustomerEmail = order.CustomerEmail
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            order.PaymentIntentId = session.Id; // Using Session Id. Can also use PaymentIntent Id

            return session.Url;
        }
    }
}
