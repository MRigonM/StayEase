using System.Net;
using UserService.API.Configurations;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); 
        
    });
});


builder.Services.ConfigureDatabase(builder.Configuration);
builder.Services.ConfigureAuthentication(builder.Configuration);
builder.Services.ConfigureSwagger();
builder.Services.ConfigureServices();


builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Loopback, 2001);
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwaggerConfiguration();
}


app.UseCors("AllowFrontend");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();