using System.Text.Json;
using StayEase.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using StayEase.Domain.Entities;

namespace StayEase.Infrastructure.Data
{
    public class DataInitializer
    {
        public static async Task SeedAsync(AppDbContext context, RoleManager<IdentityRole> roleManager)
        {
            // 1. Roles
            var roles = new List<string> { "Admin", "Owner", "Customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Users
            if (!context.Users.Any())
            {
                var users = JsonSerializer.Deserialize<List<AppUser>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Users.json"));
                if (users?.Any() == true)
                {
                    await context.Set<AppUser>().AddRangeAsync(users);
                    await context.SaveChangesAsync();
                }
            }

            // 3. Regions
            if (!context.Regions.Any())
            {
                var regions = JsonSerializer.Deserialize<List<Region>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Regions.json"));
                if (regions?.Any() == true)
                {
                    await context.Set<Region>().AddRangeAsync(regions);
                    await context.SaveChangesAsync();
                }
            }

            // 4. Countries
            if (!context.Countries.Any())
            {
                var countries = JsonSerializer.Deserialize<List<Country>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Countries.json"));
                if (countries?.Any() == true)
                {
                    await context.Set<Country>().AddRangeAsync(countries);
                    await context.SaveChangesAsync();
                }
            }

            // 5. Locations
            if (!context.Locations.Any())
            {
                var locations = JsonSerializer.Deserialize<List<Location>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Locations.json"));
                if (locations?.Any() == true)
                {
                    await context.Set<Location>().AddRangeAsync(locations);
                    await context.SaveChangesAsync();
                }
            }

            // 6. Properties
            if (!context.Properties.Any())
            {
                var properties = JsonSerializer.Deserialize<List<Property>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Properties.json"));
                if (properties?.Any() == true)
                {
                    await context.Set<Property>().AddRangeAsync(properties);
                    await context.SaveChangesAsync();
                }
            }

            // 7. Categories
            if (!context.Categories.Any())
            {
                var categories = JsonSerializer.Deserialize<List<Category>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Categories.json"));
                if (categories?.Any() == true)
                {
                    await context.Set<Category>().AddRangeAsync(categories);
                    await context.SaveChangesAsync();
                }
            }

            // 8. PropertyCategories
            if (!context.PropertyCategories.Any())
            {
                var propertyCategories = JsonSerializer.Deserialize<List<PropertyCategory>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/PropertiesCategories.json"));
                if (propertyCategories?.Any() == true)
                {
                    await context.Set<PropertyCategory>().AddRangeAsync(propertyCategories);
                    await context.SaveChangesAsync();
                }
            }

            // 9. Images
            if (!context.Images.Any())
            {
                var images = JsonSerializer.Deserialize<List<Image>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Images.json"));
                if (images?.Any() == true)
                {
                    await context.Set<Image>().AddRangeAsync(images);
                    await context.SaveChangesAsync();
                }
            }

            // 10. RoomServices
            if (!context.roomServices.Any())
            {
                var roomServices = JsonSerializer.Deserialize<List<RoomService>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/RoomServices.json"));
                if (roomServices?.Any() == true)
                {
                    await context.Set<RoomService>().AddRangeAsync(roomServices);
                    await context.SaveChangesAsync();
                }
            }

            // 11. Reviews
            if (!context.Reviews.Any())
            {
                var reviews = JsonSerializer.Deserialize<List<Review>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Reviews.json"));
                if (reviews?.Any() == true)
                {
                    await context.Set<Review>().AddRangeAsync(reviews);
                    await context.SaveChangesAsync();
                }
            }

            // 12. Bookings (last)
            if (!context.Bookings.Any())
            {
                var bookings = JsonSerializer.Deserialize<List<Booking>>(File.ReadAllText("../StayEase.Infrastructure/Data/DataSeed/Bookings.json"));
                if (bookings?.Any() == true)
                {
                    await context.Set<Booking>().AddRangeAsync(bookings);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
