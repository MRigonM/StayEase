using MailKit;
using StayEase.APIs.Extensions;
using StayEase.APIs.Utility;
using Newtonsoft.Json;
using StayEase.Application.Settings;

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
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddTransient<IMailService, MailService>();


await builder.Services.JWTConfigurations(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);


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