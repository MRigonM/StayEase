using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StayEase.Domain.Entities
{
    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // MongoDB _id
        public string? UserId { get; set; }   // ✅ tani s’del me kuqe
        public string? Email { get; set; }    // ✅ tani s’del me kuqe
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}