using MenuService.Core.interfaces;
using MenuService.Infrastructure.Persistence;
using MenuService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MenuService.Infrastructure.DependencyInjrct
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            var cs = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<MenuDbContext>(opt => opt.UseSqlServer(cs));


            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();


            return services;
        }
    }
}
