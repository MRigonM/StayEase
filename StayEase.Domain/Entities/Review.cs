using System.ComponentModel.DataAnnotations.Schema;
using StayEase.Domain.Identity;

namespace StayEase.Domain.Entities
{
	public class Review : BaseEntity<int>
	{
		public string Comment { get; set; } = string.Empty;
		public int Stars { get; set; }

		[ForeignKey("Property")]
		public string PropertyId { get; set; }
		public virtual Property Property { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
    }
}   
