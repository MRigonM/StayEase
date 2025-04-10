namespace PropertyService.Domain.Entities;

public class Property: BaseEntity<string>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal NightPrice { get; set; }
    public float Rate { get; set; }
    public string PlaceType { get; set; } = string.Empty;
}