using System.ComponentModel.DataAnnotations.Schema;
using StayEase.Domain.Identity;

namespace StayEase.Domain.Entities
{
	public class Booking : BaseEntity<int>
	{
		
        public decimal TotalPrice { get; set; }
		public DateTimeOffset StartDate { get; set; }
		public DateTimeOffset EndDate { get; set; }
		public string PaymentMethod { get; set; } = string.Empty;
		public DateTimeOffset PaymentDate { get; set; }
		public string? PaymentIntentId { get; set; }

        [ForeignKey("Property")]
        public string PropertyId { get; set; }
        public virtual Property Property { get; set; }
		

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }

    }
}
