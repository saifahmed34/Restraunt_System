using Microsoft.AspNetCore.Http;
namespace MenuService.Application.Dtos
{
    public class MenuItemCreateDto
    {
     
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public bool IsAvailable { get; set; } = true;
       
        public IFormFile? imageurl { get; set; } // only for upload
    }

}
