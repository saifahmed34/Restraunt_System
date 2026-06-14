using MenuService.Application.Dtos;

namespace MenuService.Application.Interfaces
{
    public interface IMenuService
    {
        Task<IEnumerable<MenuItemDto>> GetAllAsync();
        Task<MenuItemDto> GetByIdAsync(Guid id);
        Task<MenuItemDto> CreateAsync(MenuItemCreateDto dto);
        Task UpdateAsync(Guid id, MenuItemCreateDto dto);
        Task DeleteAsync(Guid id);
    }
}
