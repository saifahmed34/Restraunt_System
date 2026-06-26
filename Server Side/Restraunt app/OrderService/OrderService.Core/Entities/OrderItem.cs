namespace OrderService.Core.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid OrderId { get; set; }
        public Guid MenuItemId { get; set; }
        public string MenuItemName { get; set; } // Store name to avoid querying MenuService for receipts
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Navigation (optional)
        public Order Order { get; set; }
    }
}
