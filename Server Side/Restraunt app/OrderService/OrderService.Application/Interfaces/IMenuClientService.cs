using OrderService.Application.DTOs;

namespace OrderService.Application.Interfaces
{
    public interface IMenuClientService
    {
        Task<MenuItemResponseDto> GetMenuItemByIdAsync(Guid id);
    }
}
