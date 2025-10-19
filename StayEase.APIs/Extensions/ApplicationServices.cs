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
using StayEase.Application.Models;
using StayEase.Application.Services.Servi;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services.Servi;
using StayEase.Infrastructure.Data;
using StayEase.Infrastructure.Repositories;
using Stripe;

namespace StayEase.APIs.Extensions;

public static class ApplicationServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection Services, IConfiguration Configuration)
        {
            Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseMySql(Configuration.GetConnectionString("DefaultConnection"), new MySqlServerVersion(new Version(8,0,0)));
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
            Services.AddScoped<IUnitOfWork, UnitOfWork>();
            
            Services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));

            Services.AddScoped(typeof(IGenericService<,>), typeof(GenericService<,>));
            
            Services.AddScoped<IBookService, BookService>();
            Services.AddScoped<IReviewService, ReviewServices>();
            
            Services.AddScoped<IAsistentiService, AsistentiService>();
            Services.AddScoped<IDepartamentiService, DepartamentiService>();
            
            Services.AddHttpContextAccessor();
            
            #region Payment configuration
            Services.Configure<StripeSettings>(Configuration.GetSection("Stripe"));
            StripeConfiguration.ApiKey = Configuration["StripeKeys:SecretKey"];

            Services.AddScoped<IPaymentService, PaymentService>();
            #endregion

            Services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            Services.AddTransient<IMailService, MailService>();

            Services.AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssembly(typeof(CreateAccountValidator).Assembly);
            });

            return Services;
        }
    }