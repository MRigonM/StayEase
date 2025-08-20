using AutoMapper;
using Microsoft.AspNetCore.Identity;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects.Property;
using StayEase.Domain.Entities;
using StayEase.Domain.Identity;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services;
using StayEase.Infrastructure.Specifications;

namespace StayEase.Application.Services
{
    public class ReviewServices : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public ReviewServices(IUnitOfWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<Responses> AddReviewAsync(string? email, ReviewDTO review)
        {
            if (string.IsNullOrWhiteSpace(email)) return await Responses.FailurResponse("email payload fail");
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) return await Responses.FailurResponse("email is not exist");
            var MappedReview = _mapper.Map<ReviewDTO, Review>(review);
            MappedReview.UserId = user.Id;
            await _unitOfWork.Repository<Review, int>().AddAsync(MappedReview);
            var Result = await _unitOfWork.CompleteAsync();
            if (Result <= 0) return await Responses.FailurResponse("Error has been occured while adding review!");
            return await Responses.SuccessResponse("Review added successfully");
        }

        public async Task<Responses> UpdateReviewAsync(string? email, int id, ReviewDTO reviewDTO)
        {
            if (string.IsNullOrWhiteSpace(email)) return await Responses.FailurResponse("email payload fail");
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null) return await Responses.FailurResponse("email doesnt exist");
            
            var review = await _unitOfWork.Repository<Review, int>().GetByIdAsync(id);
            if (review is null) return await Responses.FailurResponse("Review doesnt exist");
             review.Stars = reviewDTO.Stars;
             review.Comment = reviewDTO.Comment;
             _unitOfWork.Repository<Review, int>().Update(review);
            var Result = await _unitOfWork.CompleteAsync();
            if (Result <= 0) return await Responses.FailurResponse("Error has been occured while updating review!");
            return await Responses.SuccessResponse("Review updated successfully");
        }

        public async Task<Responses> DeleteReviewAsync(int id)
        {
            var review = await _unitOfWork.Repository<Review, int>().GetByIdAsync(id);
            if (review != null)
            {
                _unitOfWork.Repository<Review, int>().Remove(review);
                await _unitOfWork.CompleteAsync();
                return await Responses.SuccessResponse("Review deleted successfully");
            }
            else
            {
                return await Responses.FailurResponse($"Review with ID {id} not found.");
            }
        }


        public async Task<Responses> GetReviewAsync(int id)
        {
            var review = await _unitOfWork.Repository<Review, int>().GetByIdAsync(id);
            if(review is null) return await Responses.FailurResponse("review not found", System.Net.HttpStatusCode.NotFound);
            var MappedReview = _mapper.Map<Review, ReviewDTO>(review);
            return await Responses.SuccessResponse(MappedReview);
        }

        public async Task<Responses> GetReviewsByPropertyIdAsync(string propertyId)
        {
            ReviewSpecifications spec = new ReviewSpecifications(propertyId);
            var reviews = await _unitOfWork.Repository<Review, int>().GetAllWithSpecAsync(spec);
            if (reviews is null) return await Responses.FailurResponse("there is no review yet", System.Net.HttpStatusCode.NotFound);
            var MappedReviews = _mapper.Map<IReadOnlyList<Review>, IReadOnlyList<ReviewDTO>>(reviews);
            return await Responses.SuccessResponse(MappedReviews);
        }

       
    }

}