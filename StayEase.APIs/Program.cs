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
        options.SerializerSettings.Formatting = Formatting.Indented; // Optional for pretty JSON
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerConfigurations();

await builder.Services.JWTConfigurations(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);
            
var app = builder.Build();
// Apply Pending Migrations on Database
await ExtensionMethods.ApplyMigrations(app);

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();