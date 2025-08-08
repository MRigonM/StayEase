using StayEase.Application.Resolvers;
using StayEase.Application.Services;
using StayEase.Application.Settings;
using StayEase.Domain.Identity;
using StayEase.Domain.Interfaces.Services;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using StayEase.APIs.Validators;
using StayEase.Infrastructure.Data;

namespace StayEase.APIs.Extensions;

public static class ApplicationServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection Services, IConfiguration Configuration)
        {
            Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                options.UseLazyLoadingProxies();
            });


            Services.AddSingleton<IConnectionMultiplexer>(Options =>
            {
                var Connection = Configuration.GetConnectionString("DefaultConnection");
                return ConnectionMultiplexer.Connect(Connection);
            });
            // Identity Configurations
            Services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
                options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            // AutoMapper Configuration
            Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies()); 
            Services.AddMemoryCache();
            Services.AddScoped<UserResolver>();
            Services.AddScoped<IPropertyService,PropertyService>();
            Services.AddScoped<IAuthService, AuthService>();
            Services.AddScoped<IUserService, UserService>();
            Services.AddHttpContextAccessor();
            

            Services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            Services.AddTransient<IMailService, MailService>();

            Services.AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssembly(typeof(CreateAccountValidator).Assembly);
            });

            return Services;
        }
    }