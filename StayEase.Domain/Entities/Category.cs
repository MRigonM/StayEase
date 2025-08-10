namespace StayEase.Domain.Entities
{
	public class Category : BaseEntity<int>
	{
		public string Name { get; set; } = string.Empty;
		public virtual ICollection<PropertyCategory> PropertyCategories { get; set; } = new HashSet<PropertyCategory>();

	}
}
