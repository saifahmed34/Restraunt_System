using Mapster;
using MenuService.Application.Dtos;
using MenuService.Core.Entites;
using MenuService.Core.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MenuService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;


        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _menuService.GetAllAsync();
            return Ok(items);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetBYID(Guid id)
        {
            var item = await _menuService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }



        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] MenuItemCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _menuService.CreateAsync(dto);
            return Ok(result);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromForm] MenuItemCreateDto dto)
        {
     
            await _menuService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _menuService.DeleteAsync(id);
            return NoContent();
        }
    }
}
