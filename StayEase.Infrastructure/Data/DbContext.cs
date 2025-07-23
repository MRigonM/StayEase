using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StayEase.Domain.Identity;

namespace StayEase.Infrastructure.Data;
    public class DbContext : IdentityDbContext<AppUser>
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            
    }
}
