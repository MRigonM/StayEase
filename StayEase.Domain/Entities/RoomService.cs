using System.ComponentModel.DataAnnotations.Schema;

namespace StayEase.Domain.Entities
{
    public class RoomService:BaseEntity<int>
    {
        public string Decscription {  get; set; } = string.Empty;

        [ForeignKey("Property")]
        public string PropertyId { get; set; }
        public virtual Property property { get; set; }

    }
}
