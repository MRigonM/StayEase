using Microsoft.AspNetCore.Mvc;
using StayEase.Domain;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.APIs.Controllers
{
    public class PaymentController : APIBaseController
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-payment-intent")]
        public async Task<ActionResult> CreatePaymentIntent([FromQuery] int bookId)
        {
            var paymentIntent = await _paymentService.CreatePaymentIntentAsync("eur", bookId);
            return Ok(paymentIntent);
        }
        // stripe tests
        [HttpGet("success")]
        public async Task<ActionResult<Responses>> PaymentSuccess([FromQuery] int bookingId, [FromQuery(Name = "session_id")] string sessionId = null)
        {
            var response = await _paymentService.PaymentSuccessAsync(bookingId, sessionId);
            return Ok(response);
        }


        [HttpGet("cancel")]
        public  async Task<ActionResult<Responses>> PaymentCancel([FromQuery] int bookingId)
        {
            var Response = await _paymentService.PaymentCancelAsync(bookingId);
            return Ok(Response);
        }

        [HttpPost("create-checkout-session")]
        public async Task<ActionResult<Responses>> CreateCheckoutSession(int bookingId)
        {
            var session = await _paymentService.CreateCheckoutSessioinAsync(bookingId);
            return Ok(session);
        }

        //[Authorize(Roles = "Owner")]
        [HttpPost("refund-payment")]
        public async Task<ActionResult<Responses>> RefundPayment(int bookingId)
        {
            var Refund = await _paymentService.RefundPaymentAsync(bookingId);
            return Ok(Refund);
        }
    }
}
