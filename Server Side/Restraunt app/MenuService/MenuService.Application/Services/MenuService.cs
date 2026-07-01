using Mapster;
using MenuService.Application.Dtos;
using MenuService.Application.Interfaces;
using MenuService.Core.Entites;
using MenuService.Core.interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;


namespace MenuService.Application.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IDistributedCache _cache;
        private readonly ILogger<MenuService> _logger;

        public MenuService(IMenuRepository menuRepository, IDistributedCache cache, ILogger<MenuService> logger)
        {
            _menuRepository = menuRepository;
            _cache = cache;
            _logger = logger;
        }
        public async Task<IEnumerable<MenuItemDto>> GetAllAsync()
        {
            var cacheKey = "menuItems";
            var cachedMenuItems = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedMenuItems))
            {
               var cacheditem = JsonSerializer.Deserialize<IEnumerable <MenuItemDto>>(cachedMenuItems);
                _logger.LogInformation("Retrieved menu items from cache.");
                if (cacheditem is not null)
                    return cacheditem;
            }

            var items = await _menuRepository.GetAllAsync();
            var menuItems = items.Select(i => new MenuItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                Price = i.Price,
                CategoryId = i.CategoryId,
                IsAvailable = i.IsAvailable,
                imageurl = i.imageurl

            }).ToList();

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            };
            _logger.LogInformation($"Caching menu items.{string.Join(", ", menuItems.Select(m => m.Name))}");
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(menuItems), options);
            return menuItems;

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

            if (dto.imageurl is not null)
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

            if (dto.imageurl is not null)
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
