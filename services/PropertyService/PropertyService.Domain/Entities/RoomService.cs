using System.ComponentModel.DataAnnotations.Schema;

namespace PropertyService.Domain.Entities;

public class RoomService
{
    public string Decscription {  get; set; } = string.Empty;

    [ForeignKey("Property")]
    public string PropertyId { get; set; }
    public virtual Property property { get; set; }
}