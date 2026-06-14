namespace MenuService.Application.Dtos
{
    public class MenuItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public Guid CategoryId { get; set; }
        public bool IsAvailable { get; set; }
        public string imageurl { get; set; }
    }
}
