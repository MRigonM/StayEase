namespace StayEase.Domain.Entities
{
	public class Region : BaseEntity<int>
	{ 
		public string Name { get; set; } = string.Empty;
		public virtual ICollection<Country> Countries { get; set; }= new HashSet<Country>();
	}
}
