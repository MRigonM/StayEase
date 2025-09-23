using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StayEase.Domain.Entities;
using StayEase.Domain.Identity;

namespace StayEase.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
        {

            builder.Entity<Property>(p =>
            {
                p.Property(prop => prop.Id).ValueGeneratedNever();

                p.HasMany(prop => prop.Bookings)
                    .WithOne(b => b.Property)
                    .HasForeignKey(b => b.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);

                p.HasMany(prop => prop.Images)
                    .WithOne(i => i.Property)
                    .HasForeignKey(i => i.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);

                p.HasMany(prop => prop.RoomServices)
                    .WithOne(rs => rs.Property) 
                    .HasForeignKey(rs => rs.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);

                p.HasMany(prop => prop.Reviews)
                    .WithOne(r => r.Property)
                    .HasForeignKey(r => r.PropertyId)
                    .OnDelete(DeleteBehavior.Cascade);

                p.HasOne(prop => prop.Owner)
                    .WithMany(u => u.Properties)
                    .HasForeignKey(prop => prop.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PropertyCategory>(pc =>
            {
                pc.HasOne(pc => pc.Property)
                    .WithMany(p => p.PropertyCategories)
                    .HasForeignKey(pc => pc.PropertyId);

                pc.HasOne(pc => pc.Category)    // ✅ added
                    .WithMany(c => c.PropertyCategories)
                    .HasForeignKey(pc => pc.CategoryId);
            });

            base.OnModelCreating(builder);
        }
    
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Country> Countries { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Property> Properties { get; set; }
    public DbSet<PropertyCategory> PropertyCategories { get; set; }
    public DbSet<Region> Regions { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<RoomService> roomServices { get; set; }
}