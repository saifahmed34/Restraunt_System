using Mapster;
using MenuService.Application.Dtos;
using MenuService.Core.Entites;
using MenuService.Core.interfaces;
using MenuService.Application.Interfaces;

namespace MenuService.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<CategoryDto> CreateAsync(CategoryDto dto)
        {
            // Map DTO to entity
            var entity = dto.Adapt<Category>();

            // Generate new ID if needed
            if (entity.Id == Guid.Empty)
                entity.Id = Guid.NewGuid();

            await _categoryRepository.AddAsync(entity);

            // Map back to DTO (including the new ID)
            var resultDto = entity.Adapt<CategoryDto>();
            return resultDto;
        }
        public async Task DeleteAsync(Guid id)
        {
            await _categoryRepository.DeleteAsync(id);
        }
        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var cats = await _categoryRepository.GetAllAsync();

            // Map the list of entities to a list of DTOs
            return cats.Adapt<List<CategoryDto>>();
        }
        public async Task<CategoryDto> GetByIdAsync(Guid id)
        {
            var c = await _categoryRepository.GetByIdAsync(id);
            if (c == null) return null;

            // Use Mapster to map entity to DTO
            return c.Adapt<CategoryDto>();
        }
        public async Task UpdateAsync(Guid id, CategoryDto dto)
        {
            // Fetch existing entity
            var entity = await _categoryRepository.GetByIdAsync(id);
            if (entity == null) throw new KeyNotFoundException("Category not found");

            entity.Name = dto.Name;
            entity.Description = dto.Description;

            await _categoryRepository.UpdateAsync(entity);
        }
    }
}
