using StayEase.Domain.Entities;

namespace StayEase.Infrastructure.Specifications
{
    public class BookingWithPaymentIntentSpecification : BaseSpecifications<Booking, int>
    {
        public BookingWithPaymentIntentSpecification(string PaymentIntentId) : base(B => B.PaymentIntentId == PaymentIntentId)
        {

        }
    }
}
