using MenuService.Application.Dtos;

namespace MenuService.Core.interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<CategoryDto> GetByIdAsync(Guid id);
        Task<CategoryDto> CreateAsync(CategoryDto dto);
        Task UpdateAsync(Guid id ,CategoryDto dto);
        Task DeleteAsync(Guid id);
    }
}
