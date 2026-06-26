namespace OrderService.Application.DTOs
{
    public class CreateOrderDto
    {
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        public string SuccessUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
