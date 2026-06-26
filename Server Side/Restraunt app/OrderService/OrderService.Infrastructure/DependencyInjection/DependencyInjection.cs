using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OrderService.Application.Interfaces;
using OrderService.Application.Services;
using OrderService.Core.Interfaces;
using OrderService.Infrastructure.Persistence;
using OrderService.Infrastructure.Repositories;
using OrderService.Infrastructure.Services;
using Resend;

namespace OrderService.Infrastructure.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var cs = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<OrderDbContext>(opt => opt.UseSqlServer(cs));

            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IPaymentService, StripePaymentService>();
            services.AddScoped<IEmailService, ResendEmailService>();
            // Application Services
            services.AddScoped<IOrderManagerService, OrderManagerService>();

            // Http Client
            services.AddHttpClient<IMenuClientService, MenuClientService>(client =>
            {
                client.BaseAddress = new Uri(configuration["MenuServiceUrl"]);
            });

            // Resend
            services.AddResend(options =>
            {
                options.ApiToken = configuration["Resend:ApiKey"];
            });

            return services;
        }
    }
}
