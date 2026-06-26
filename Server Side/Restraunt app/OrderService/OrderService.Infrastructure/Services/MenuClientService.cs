using System.Net.Http.Json;
using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;

namespace OrderService.Infrastructure.Services
{
    public class MenuClientService : IMenuClientService
    {
        private readonly HttpClient _httpClient;

        public MenuClientService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<MenuItemResponseDto> GetMenuItemByIdAsync(Guid id)
        {
            var response = await _httpClient.GetAsync($"/api/menu/{id}");
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<MenuItemResponseDto>();
        }
    }
}
