using MenuService.Core.Entites;
using MenuService.Core.interfaces;
using MenuService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MenuService.Infrastructure.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly MenuDbContext _db;


        public MenuRepository(MenuDbContext db)
        {
            _db = db;
        }
        public async Task AddAsync(MenuItem item)
        {
            _db.MenuItems.Add(item);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var e = await _db.MenuItems.FindAsync(id);
            if (e == null) return;
            _db.MenuItems.Remove(e);
            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<MenuItem>> GetAllAsync()
        {
            return await _db.MenuItems.AsNoTracking().ToListAsync();
        }

        public async Task<MenuItem> GetByIdAsync(Guid id)
        {
            // Throws if not found, matching interface contract (non-nullable return)
            var item = await _db.MenuItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (item == null)
                throw new InvalidOperationException($"MenuItem with id {id} not found.");
            return item;
        }

        public async Task UpdateAsync(MenuItem item)
        {
            _db.MenuItems.Update(item);
            await _db.SaveChangesAsync();
        }
    }
}
