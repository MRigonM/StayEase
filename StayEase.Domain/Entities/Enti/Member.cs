using System.ComponentModel.DataAnnotations.Schema;

namespace StayEase.Domain.Entities.Enti;

public class Member : BaseEntity<int>
{
    public string Name { get; set; }
    public string Role { get; set; }
    [ForeignKey("Group")]
    public int GroupId { get; set; }
    public string GroupName { get; set; }
}