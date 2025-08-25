using StayEase.Domain.Entities;

namespace StayEase.Infrastructure.Specifications
{
    public class ReviewSpecifications : BaseSpecifications<Review, int>
    {
        public ReviewSpecifications(string propertyId) : base(R => R.PropertyId == propertyId) 
        {
        }
    }
}
