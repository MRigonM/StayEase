using Microsoft.AspNetCore.Identity;
using StayEase.Domain.Identity;

namespace StayEase.Domain.Interfaces.Services
{
    public interface IAuthService
    {
        Task<string> CreateTokenAsync(AppUser user,UserManager<AppUser>_userManager);
 
    }
}
