using System.ComponentModel.DataAnnotations.Schema;
using PropertyService.Domain;
using PropertyService.Domain.Entities;

namespace UserService.Domain.Entities;

public class Review: BaseEntity<int>
{
    public string Comment { get; set; } = string.Empty;
    public int Stars { get; set; }

    [ForeignKey("Property")]
    public string PropertyId { get; set; }
    public virtual Property Property { get; set; }

    [ForeignKey("User")]
    public string UserId { get; set; }
    public virtual ApplicationUser User { get; set; }
}