using System.ComponentModel.DataAnnotations.Schema;

namespace StayEase.Domain.Entities
{
    public class PropertyCategory : BaseEntity<int>
    {
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }


        [ForeignKey("Property")]
        public string PropertyId { get; set; }
        public virtual Property Property { get; set; }
    }
}
