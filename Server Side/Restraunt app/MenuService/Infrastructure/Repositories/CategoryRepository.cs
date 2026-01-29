using MenuService.Core.Entites;
using MenuService.Core.interfaces;
using MenuService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MenuService.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly MenuDbContext _dbContext;

        public CategoryRepository(MenuDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddAsync(Category category)
        {
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var item = await _dbContext.Categories.FindAsync(id);
            if (item == null) return;
            _dbContext.Categories.Remove(item);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _dbContext.Categories.AsNoTracking().ToListAsync();
        }

        public async Task<Category> GetByIdAsync(Guid id)
        {
            return await _dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

        }

        public async Task UpdateAsync(Category category)
        {
            _dbContext.Categories.Update(category);
            await _dbContext.SaveChangesAsync();
        }
    }
}
