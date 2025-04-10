
namespace PropertyService.Domain.Entities;

public class Country: BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<Location> Locations { get; set; } = new HashSet<Location>(); 
}