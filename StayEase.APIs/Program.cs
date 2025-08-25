using StayEase.APIs.Extensions;
using StayEase.APIs.Utility;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers();
builder.Services.AddMvc()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        options.SerializerSettings.Formatting = Formatting.Indented;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerConfigurations();

await builder.Services.JWTConfigurations(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);

// ✅ CORS: lejove React-in në :3000
var corsPolicy = "ReactCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// ✅ (opsionale) Hiqe në DEV nëse po godet HTTP :5000 nga React
// app.UseHttpsRedirection();

await ExtensionMethods.ApplyMigrations(app);

{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseRouting();          
app.UseCors(corsPolicy);   
app.UseAuthentication();   
app.UseAuthorization();    

app.MapControllers();

app.Run();