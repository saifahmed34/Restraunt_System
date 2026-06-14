using MenuService.Application.Dtos;
using MenuService.Core.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MenuService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;


        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var items = await _categoryService.GetAllAsync();
            return Ok(items);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var item = await _categoryService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryDto dto)
        {
            // Call service to create category
            var createdDto = await _categoryService.CreateAsync(dto);

            // Return 201 Created with the new ID
            return CreatedAtAction(nameof(GetCategoryById), new { id = createdDto.Id }, createdDto);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id,CategoryDto dto)
        {
            await _categoryService.UpdateAsync(id, dto);
            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _categoryService.DeleteAsync(id);
            return NoContent();
        }
    }
}
