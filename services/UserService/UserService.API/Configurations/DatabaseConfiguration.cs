using Microsoft.EntityFrameworkCore;
using UserService.Infrastructure.Persistence;

namespace UserService.API.Configurations;

public static class DatabaseConfiguration
{
    public static void ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<UserServiceDbContext>(options =>
            options.UseMySql(
                configuration.GetConnectionString("DefaultConnection"),
                ServerVersion.AutoDetect(configuration.GetConnectionString("DefaultConnection")),
                b => b.MigrationsAssembly(typeof(UserServiceDbContext).Assembly.FullName)
            ));
    }
}