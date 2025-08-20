using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects.Property;
using StayEase.Domain.Identity;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.APIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly UserManager<AppUser> _userManager;

        public ReviewController(IReviewService reviewService, UserManager<AppUser> userManager)
        {
            _reviewService = reviewService;
            _userManager = userManager;
        }

        [HttpGet("GetReview/{id}")]
        public async Task<IActionResult> GetReview(int id)
        {
            var review = await _reviewService.GetReviewAsync(id);
            if (review != null)
            {
                return Ok(await Responses.SuccessResponse(review, "Review retrieved successfully."));
            }
            return NotFound(await Responses.FailurResponse($"Review with ID {id} not found."));
        }

        [HttpPost("AddReview")]
        public async Task<IActionResult> AddReview([FromBody] ReviewDTO review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(await Responses.FailurResponse(ModelState));
            }
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Ok(Responses.SuccessResponse("User not found"));
            var userEmail = user.Email;
            await _reviewService.AddReviewAsync(userEmail, review);
            return Ok(Responses.SuccessResponse("Review added successfully"));
        }

        [HttpPut("UpdateReview/{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewDTO review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(await Responses.FailurResponse(ModelState));
            }

            var existingReview = await _reviewService.GetReviewAsync(id);
            if (existingReview == null)
            {
                return NotFound(await Responses.FailurResponse($"Review with ID {id} not found."));
            }

            // Replace with Update method if implemented
            var user = await _userManager.GetUserAsync(User);
            if (user is null) return Ok(Responses.SuccessResponse("User not found"));
            var userEmail = user.Email;
            await _reviewService.UpdateReviewAsync(userEmail, id, review);
            return Ok(await Responses.SuccessResponse(review, "Review updated successfully."));
        }

        [HttpDelete("DeleteReview/{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _reviewService.GetReviewAsync(id);
            if (review == null)
            {
                return NotFound(await Responses.FailurResponse($"Review with ID {id} not found."));
            }

            await _reviewService.DeleteReviewAsync(id);
            return Ok(await Responses.SuccessResponse("Review deleted successfully."));
        }

        [HttpGet("Property/{propertyId}")]
        public async Task<IActionResult> GetReviewsByProperty(string propertyId)
        {
            var reviews = await _reviewService.GetReviewsByPropertyIdAsync(propertyId);
            if (reviews != null)
            {
                return Ok(await Responses.SuccessResponse(reviews, $"Reviews for Property ID {propertyId} retrieved successfully."));
            }
            return NotFound(await Responses.FailurResponse($"No reviews found for Property ID {propertyId}."));
        }
    }
}
