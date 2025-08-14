using StayEase.Domain.Entities;

namespace StayEase.Infrastructure.Specifications
{
    public class BookingSpecifications : BaseSpecifications<Booking, int>
    {
        public BookingSpecifications(string userId) : base(B => B.UserId == userId)
        {
            
        }
    }
}
