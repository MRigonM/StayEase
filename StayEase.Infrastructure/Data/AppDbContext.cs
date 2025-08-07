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

            builder.Entity<Property>(P =>
            {
                P.Property(p => p.Id).ValueGeneratedNever();

                #region Done
                P.HasMany(B => B.Bookings)
               .WithOne(P => P.Property)
               .HasForeignKey(P => P.PropertyId)
               .OnDelete(DeleteBehavior.Cascade);

                #endregion
                P.HasMany(i => i.Images)
                .WithOne(p => p.Property)
                .HasForeignKey(p => p.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

                P.HasMany(i => i.RoomServices)
                .WithOne(p => p.property)
                .HasForeignKey(p => p.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

                P.HasMany(i => i.Reviews)
                .WithOne(p => p.Property)
                .HasForeignKey(p => p.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

                P.HasOne(O => O.Owner)
                .WithMany(p => p.Properties)
                .HasForeignKey(o => o.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            });

            builder.Entity<AppUser>(U =>
            {
                U.HasMany(p => p.Properties)
                     .WithOne(u => u.Owner)
                     .HasForeignKey(f => f.OwnerId)
                     .OnDelete(DeleteBehavior.Restrict);

                U.HasMany(p => p.Reviews)
                     .WithOne(u => u.User)
                     .HasForeignKey(f => f.UserId)
                     .OnDelete(DeleteBehavior.Restrict);

                U.HasMany(p => p.Bookings)
                     .WithOne(u => u.User)
                     .HasForeignKey(f => f.UserId)
                     .OnDelete(DeleteBehavior.Cascade);

            });

            builder.Entity<Location>(L =>
            {
                L.HasMany(p => p.Properties)
                .WithOne(l => l.Location)
                .HasForeignKey(l => l.LocationId)
                .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Country>(C =>
                        {
                            C.HasMany(l => l.Locations)
                            .WithOne(c => c.Country)
                            .HasForeignKey(c => c.CountryId)
                            .OnDelete(DeleteBehavior.Cascade);
                        });

            builder.Entity<Region>(L =>
            {
                L.HasMany(C => C.Countries)
                .WithOne(R => R.Region)
                .HasForeignKey(R => R.RegionId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PropertyCategory>(PC =>
            {
                PC.HasOne(PC => PC.Property)
                  .WithMany(P => P.PropertyCategories)
                  .HasForeignKey(PC => PC.PropertyId);
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