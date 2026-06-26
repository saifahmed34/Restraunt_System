using OrderService.Core.Enums;

namespace OrderService.Application.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
