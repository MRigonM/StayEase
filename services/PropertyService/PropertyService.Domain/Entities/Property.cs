using System.ComponentModel.DataAnnotations.Schema;

namespace PropertyService.Domain.Entities;

public class Property: BaseEntity<string>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal NightPrice { get; set; }
    public float Rate { get; set; }
    public string PlaceType { get; set; } = string.Empty;
    [ForeignKey("Location")]
    public int LocationId { get; set; }
    public virtual Location Location { get; set; }
    public virtual ICollection<Image> Images { get; set; } = new HashSet<Image>();
    public virtual ICollection<PropertyCategory> PropertyCategories { get; set; } = new HashSet<PropertyCategory>();
}