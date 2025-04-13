using System.ComponentModel.DataAnnotations.Schema;

namespace PropertyService.Domain.Entities;

public class Image: BaseEntity<int>
{
    public string Url { get; set; } = string.Empty;

    public virtual Property Property { get; set; }
    [ForeignKey("Property")]	
    public string PropertyId { get; set; }
		
}