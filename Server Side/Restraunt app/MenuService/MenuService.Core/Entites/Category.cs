namespace MenuService.Core.Entites
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}
