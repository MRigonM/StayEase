using System.Text.Json;
using StayEase.Domain.Identity;
using Microsoft.AspNetCore.Identity;

namespace StayEase.Infrastructure.Data;

    public class DataInitializer
    {
        public static async Task SeedAsync(DbContext context, RoleManager<IdentityRole> roleManager)
        {
            var roles = new List<string> { "Admin", "Owner", "Customer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            if (!context.Users.Any())
            {
                string path = "../StayEase.Infrastructure/Data/DataSeed/Users.json";
                var UsersData = File.ReadAllText(path);
                var users = JsonSerializer.Deserialize<List<AppUser>>(UsersData);

                if (users.Count() > 0)
                {
                    foreach (var user in users)
                    {
                        await context.Set<AppUser>().AddAsync(user);
                    }
                }

                await context.SaveChangesAsync();
            }
        }
    }

