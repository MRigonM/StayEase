using System.Net;
using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects.Booking;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.APIs.Controllers
{
    public class BookingController : APIBaseController
    {
        private readonly IBookService _bookService;
        private readonly IValidator<BookingToCreateDTO> _bookingToCreateValidator;
        private readonly IPaymentService _paymentService;

        public BookingController(IBookService bookService, 
                                 IValidator<BookingToCreateDTO> bookingToCreateValidator,
                                 IPaymentService paymentService)
        {
            _bookService = bookService;
            _bookingToCreateValidator = bookingToCreateValidator;
            _paymentService = paymentService;
        }
        //[Authorize]
        [HttpPost("CreateBooking")]
        public async Task<ActionResult<Responses>> CreateBooking([FromBody] BookingToCreateDTO bookDTO)
        {
            var validate = await _bookingToCreateValidator.ValidateAsync(bookDTO);
            if (!validate.IsValid) return await Responses.FailurResponse(validate.Errors, HttpStatusCode.BadRequest);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email is null)
            {
                return await Responses.FailurResponse("email is not found try again");
            }

            return Ok(await _bookService.CreateBookingByPropertyId(email, bookDTO));
        }
    }
}
