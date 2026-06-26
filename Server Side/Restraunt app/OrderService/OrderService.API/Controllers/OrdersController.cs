using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;
using Stripe;

namespace OrderService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class OrdersController : ControllerBase
    {
        private readonly IOrderManagerService _orderManagerService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderManagerService orderManagerService, IConfiguration configuration, ILogger<OrdersController> logger)
        {
            _orderManagerService = orderManagerService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            try
            {
                // We assume the JWT contains the 'sub' or 'id' claim for userId and 'email' claim.
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? Guid.NewGuid().ToString();
                var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? "[EMAIL_ADDRESS]"; // Fallback for testing if missing

                var sessionUrl = await _orderManagerService.CreateOrderCheckoutSessionAsync(userId, userEmail, dto);

                return Ok(new { url = sessionUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeSignature = Request.Headers["Stripe-Signature"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                  json,
                  stripeSignature,
                  _configuration["Stripe:WebhookSecret"]
                );

                if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Stripe.Checkout.Session;

                    // Session Id is what we stored in PaymentIntentId
                    await _orderManagerService.HandlePaymentSuccessAsync(session.Id);
                }

                return Ok();
            }
            catch (StripeException e)
            {
                _logger.LogError(e, "Stripe Webhook Error");
                return BadRequest();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "General Webhook Error");
                return StatusCode(500);
            }
        }
    }
}
