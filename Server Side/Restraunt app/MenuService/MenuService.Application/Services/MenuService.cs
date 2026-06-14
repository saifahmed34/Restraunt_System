using Mapster;
using MenuService.Application.Dtos;
using MenuService.Core.Entites;
using MenuService.Core.interfaces;
using Microsoft.AspNetCore.Mvc;


namespace MenuService.Application.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menuRepository;


        public MenuService(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;

        }
        public async Task<IEnumerable<MenuItemDto>> GetAllAsync()
        {
            var items = await _menuRepository.GetAllAsync();
            return items.Select(i => new MenuItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                Price = i.Price,
                CategoryId = i.CategoryId,
                IsAvailable = i.IsAvailable,
                imageurl = i.imageurl

            });

        }




        public async Task<MenuItemDto?> GetByIdAsync(Guid id)
        {
            var i = await _menuRepository.GetByIdAsync(id);
            if (i == null) return null;

            return new MenuItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                Price = i.Price,
                CategoryId = i.CategoryId,
                IsAvailable = i.IsAvailable,
                imageurl = i.imageurl
            };
        }




        public async Task<MenuItemDto> CreateAsync(MenuItemCreateDto dto)
        {
            var entity = new MenuItem
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                IsAvailable = dto.IsAvailable
            };

            if (dto.imageurl != null)
            {
                var uploadsPath = Path.Combine("wwwroot", "images");
                Directory.CreateDirectory(uploadsPath);

                var fileName = $"{Guid.NewGuid()}_{dto.imageurl.FileName}";
                var fullPath = Path.Combine(uploadsPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await dto.imageurl.CopyToAsync(stream);

                entity.imageurl = $"/images/{fileName}";
            }

            await _menuRepository.AddAsync(entity);
            return entity.Adapt<MenuItemDto>();
        }



        public async Task UpdateAsync(Guid id ,MenuItemCreateDto dto)
        {
            var entity = await _menuRepository.GetByIdAsync(id);
            if (entity == null) throw new Exception("Menu item not found");

            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.Price = dto.Price;
            entity.CategoryId = dto.CategoryId;
            entity.IsAvailable = dto.IsAvailable;

            if (dto.imageurl != null)
            {
                var uploadsPath = Path.Combine("wwwroot", "images");
                Directory.CreateDirectory(uploadsPath);

                var fileName = $"{Guid.NewGuid()}_{dto.imageurl.FileName}";
                var fullPath = Path.Combine(uploadsPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await dto.imageurl.CopyToAsync(stream);

                entity.imageurl = $"/images/{fileName}";
            }



            await _menuRepository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _menuRepository.DeleteAsync(id);

        }
    }
}
