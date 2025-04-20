
using PropertyService.Domain.Entities;

namespace UserService.Domain.Entities;

using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public virtual ICollection <Property> Properties { get; set; } = new HashSet<Property>();
    public virtual ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
}