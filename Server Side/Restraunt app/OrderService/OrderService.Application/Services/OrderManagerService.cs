using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;
using OrderService.Core.Entities;
using OrderService.Core.Enums;
using OrderService.Core.Interfaces;

namespace OrderService.Application.Services
{
    public class OrderManagerService : IOrderManagerService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IPaymentService _paymentService;
        private readonly IEmailService _emailService;
        private readonly IMenuClientService _menuClientService;

        public OrderManagerService(
            IOrderRepository orderRepository,
            IPaymentService paymentService,
            IEmailService emailService,
            IMenuClientService menuClientService)
        {
            _orderRepository = orderRepository;
            _paymentService = paymentService;
            _emailService = emailService;
            _menuClientService = menuClientService;
        }

        public async Task<string> CreateOrderCheckoutSessionAsync(string userId, string userEmail, CreateOrderDto dto)
        {
            var order = new Order
            {
                UserId = userId,
                CustomerEmail = userEmail,
                Status = OrderStatus.Pending
            };

            decimal totalAmount = 0;

            foreach (var itemDto in dto.Items)
            {
                // Validate with MenuService
                var menuItem = await _menuClientService.GetMenuItemByIdAsync(itemDto.MenuItemId);
                
                if (menuItem == null || !menuItem.IsAvailable)
                {
                    throw new Exception($"Menu item {itemDto.MenuItemId} is not available.");
                }

                var orderItem = new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    MenuItemName = menuItem.Name,
                    Quantity = itemDto.Quantity,
                    UnitPrice = menuItem.Price
                };

                totalAmount += (orderItem.UnitPrice * orderItem.Quantity);
                order.OrderItems.Add(orderItem);
            }

            order.TotalAmount = totalAmount;

            // Save order to db (Pending)
            await _orderRepository.CreateOrderAsync(order);

            // Create Stripe Checkout Session
            var sessionUrl = await _paymentService.CreateCheckoutSessionAsync(order, dto.SuccessUrl, dto.CancelUrl);

            // Update order with payment intent/session id after creating it
            await _orderRepository.UpdateOrderAsync(order);

            return sessionUrl;
        }

        public async Task HandlePaymentSuccessAsync(string paymentIntentId)
        {
            var order = await _orderRepository.GetOrderByPaymentIntentIdAsync(paymentIntentId);
            if (order != null && order.Status != OrderStatus.Paid)
            {
                order.Status = OrderStatus.Paid;
                await _orderRepository.UpdateOrderAsync(order);

                // Send email receipt
                await _emailService.SendOrderSuccessEmailAsync(order);
            }
        }
    }
}
