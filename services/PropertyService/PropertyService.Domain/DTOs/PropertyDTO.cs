namespace PropertyService.Domain.DTOs;

public class PropertyDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal NightPrice { get; set; }
    public string PlaceType { get; set; }
    public LocationDto Location { get; set;}
    public CountryDto Country { get; set; }
    public IEnumerable<string> ImageUrls { get; set; }
    public IEnumerable<CategoryDto> Categories { get; set; } 
    public IEnumerable<RoomServicesDto> RoomServices { get; set; }
}