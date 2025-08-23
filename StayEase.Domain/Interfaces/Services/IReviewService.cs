using StayEase.Domain.DataTransferObjects.Property;

namespace StayEase.Domain.Interfaces.Services
{
    public interface IReviewService
    {
        Task<Responses> GetReviewAsync(int id);
        Task<Responses> AddReviewAsync(string? email, ReviewDTO review);
        Task<Responses> GetReviewsByPropertyIdAsync(string propertyId);
        Task<Responses> DeleteReviewAsync(int id);
        Task<Responses> UpdateReviewAsync(string? email, int id, ReviewDTO reviewDTO);
    }
}
