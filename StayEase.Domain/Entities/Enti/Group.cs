namespace StayEase.Domain.Entities.Enti;

public class Group : BaseEntity<int>
{
    public string GroupName { get; set; }
    public string Description { get; set; }
}