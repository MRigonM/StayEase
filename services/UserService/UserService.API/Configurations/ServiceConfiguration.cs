using UserService.Application.Interfaces;
using UserService.Application.Services.Auth;
using UserService.Infrastructure.Authentication;

namespace UserService.API.Configurations;

public static class ServiceConfiguration
{
    public static void ConfigureServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITokenService, TokenService>();
    }
}