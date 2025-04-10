using System.ComponentModel.DataAnnotations.Schema;

namespace PropertyService.Domain.Entities;

public class Location: BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;
    public virtual Country Country { get; set; }
    [ForeignKey("Country")]
    public int CountryId { get; set; }
    public virtual ICollection<Property> Properties { get; set; } = new HashSet<Property>();
}
