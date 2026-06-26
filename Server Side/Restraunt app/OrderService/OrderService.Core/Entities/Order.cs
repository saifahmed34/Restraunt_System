using OrderService.Core.Enums;

namespace OrderService.Core.Entities
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } // We get this from JWT
        public string CustomerEmail { get; set; } // Needed for Resend email receipt
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? PaymentIntentId { get; set; } // Store the Stripe session or intent ID
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
