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

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();

// ⚠️ RENDITJA E SAKTË
app.UseRouting();          // 1) routing
app.UseCors(corsPolicy);   // 2) CORS KËTU → kap preflight OPTIONS
app.UseAuthentication();   // 3) auth
app.UseAuthorization();    // 4) authorization

app.MapControllers();

app.Run();