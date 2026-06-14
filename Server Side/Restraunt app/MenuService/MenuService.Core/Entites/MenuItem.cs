namespace MenuService.Core.Entites
{
    public class MenuItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string? imageurl { get; set; }


        // Navigation (optional)
        public Category Category { get; set; }
    }
}
