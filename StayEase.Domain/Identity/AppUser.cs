using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace StayEase.Domain.Identity
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        [RegularExpression(@"^\d+-[A-Za-z]+-[A-Za-z]+-[A-Za-z]+$", ErrorMessage = "The address must follow the pattern '123-street-city-country'.")]
        public string Address { get; set; } = string.Empty;
        public string? ProfileImage { get; set; }
    }
}
