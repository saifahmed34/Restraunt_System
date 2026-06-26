namespace OrderService.Application.DTOs
{
    public class MenuItemResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
    }
}
