using MenuService.Core.Entites;

namespace MenuService.Core.interfaces
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetAllAsync();
        Task<MenuItem> GetByIdAsync(Guid id);
        Task AddAsync(MenuItem item);
        Task UpdateAsync( MenuItem item);
        Task DeleteAsync(Guid id);
    }
}
