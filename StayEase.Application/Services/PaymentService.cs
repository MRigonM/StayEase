using Microsoft.Extensions.Configuration;
using StayEase.Domain;
using StayEase.Domain.DataTransferObjects;
using StayEase.Domain.Entities;
using StayEase.Domain.Interfaces.Repositories;
using StayEase.Domain.Interfaces.Services;
using Stripe;
using Stripe.Checkout;

namespace StayEase.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public PaymentService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<Responses> CreatePaymentIntentAsync(string currency, int bookingId)
        {
            var booking = await _unitOfWork.Repository<Booking, int>().GetByIdAsync(bookingId);
            if (booking is null) return await Responses.FailurResponse("there is no booking with this id!");

            var Service = new PaymentIntentService();
            PaymentIntent paymentIntent;

            if (string.IsNullOrEmpty(booking.PaymentIntentId))
            {
                var Options = new PaymentIntentCreateOptions()
                {
                    Amount = (long)(booking.TotalPrice * 100),
                    Currency = "eur",
                    PaymentMethodTypes = new List<string>() { "card" }
                };

                paymentIntent = await Service.CreateAsync(Options);
                booking.PaymentIntentId = paymentIntent.Id;
            }
            else
            {
                var Options = new PaymentIntentUpdateOptions()
                {
                    Amount = (long)(booking.TotalPrice * 100)
                };

                paymentIntent = await Service.UpdateAsync(booking.PaymentIntentId, Options);

                booking.PaymentIntentId = paymentIntent.Id;
            }


            _unitOfWork.Repository<Booking, int>().Update(booking);

            var Result = await _unitOfWork.CompleteAsync();

            if (Result <= 0) return await Responses.FailurResponse("Error has been occured while updating the paying status!");

            var customer = new CustomerDTO()
            {
                PaymentIntentId = paymentIntent.Id,
                ClientSecret = paymentIntent.ClientSecret
            };
            return await Responses.SuccessResponse(customer);
        }
        
        public async Task<Responses> CreateCheckoutSessioinAsync(int bookingId)
        {
            var booking = await _unitOfWork.Repository<Booking, int>().GetByIdAsync(bookingId);
            if (booking is null) return await Responses.FailurResponse("booking is not found", System.Net.HttpStatusCode.NotFound);

            string BaseUrl = _configuration["BaseUrl"];
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(booking.TotalPrice * 100),
                            Currency = "eur",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = booking.Property.Name,
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",

                // IMPORTANT: include the session id placeholder so Stripe will append session_id to the redirect
                SuccessUrl = BaseUrl + $"api/payment/success?bookingId={booking.Id}&session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl  = BaseUrl + $"api/payment/cancel?bookingId={booking.Id}",
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return await Responses.SuccessResponse(session.Url);
        }

        
        public async Task<Responses> PaymentCancelAsync(int bookingId)
        {
            var booking = await _unitOfWork.Repository<Booking, int>().GetByIdAsync(bookingId);
            if (booking is null) return await Responses.FailurResponse("booking is not found", System.Net.HttpStatusCode.NotFound);

            booking.Status = BookingStatus.Canceled;
            _unitOfWork.Repository<Booking, int>().Update(booking);
            var Result = await _unitOfWork.CompleteAsync();
            if (Result <= 0) return await Responses.FailurResponse("Error has been occured while updating", System.Net.HttpStatusCode.InternalServerError);
            return await Responses.SuccessResponse("Payment was canceled by the user, The owner will Take an action to refund your money if needed!");
        }

        public async Task<Responses> PaymentSuccessAsync(int bookingId, string sessionId = null)
            {
                var booking = await _unitOfWork.Repository<Booking, int>().GetByIdAsync(bookingId);
                if (booking is null) return await Responses.FailurResponse("booking is not found", System.Net.HttpStatusCode.NotFound);

                // If sessionId was provided (from Checkout redirect), fetch session and save PaymentIntentId
                if (!string.IsNullOrEmpty(sessionId))
                {
                    var sessionService = new SessionService();
                    Session session;
                    try
                    {
                        session = await sessionService.GetAsync(sessionId);
                    }
                    catch (StripeException)
                    {
                        return await Responses.FailurResponse("Stripe session not found.", System.Net.HttpStatusCode.BadRequest);
                    }

                    // session.PaymentIntentId will contain the id of the PaymentIntent created by Checkout
                    if (!string.IsNullOrEmpty(session.PaymentIntentId))
                    {
                        booking.PaymentIntentId = session.PaymentIntentId;
                        _unitOfWork.Repository<Booking, int>().Update(booking);
                        var saveResult = await _unitOfWork.CompleteAsync();
                        if (saveResult <= 0)
                            return await Responses.FailurResponse("Failed to save PaymentIntentId to booking.", System.Net.HttpStatusCode.InternalServerError);
                    }
                    else
                    {
                        // No PaymentIntent on the session — maybe payment not completed
                        return await Responses.FailurResponse("Checkout session has no PaymentIntent yet.", System.Net.HttpStatusCode.BadRequest);
                    }
                }

                // Optional: verify PaymentIntent status is succeeded before marking as paid
                if (!string.IsNullOrEmpty(booking.PaymentIntentId))
                {
                    var paymentIntentService = new PaymentIntentService();
                    var paymentIntent = await paymentIntentService.GetAsync(booking.PaymentIntentId);

                    if (paymentIntent == null || paymentIntent.Status != "succeeded")
                    {
                        return await Responses.FailurResponse("Payment not completed yet.", System.Net.HttpStatusCode.BadRequest);
                    }
                }
                else
                {
                    return await Responses.FailurResponse("No PaymentIntentId associated with booking.", System.Net.HttpStatusCode.BadRequest);
                }

                // Update booking status
                booking.Status = BookingStatus.PaymentReceived;
                _unitOfWork.Repository<Booking, int>().Update(booking);
                var result = await _unitOfWork.CompleteAsync();
                if (result <= 0) return await Responses.FailurResponse("Error has been occured while updating", System.Net.HttpStatusCode.InternalServerError);

                return await Responses.SuccessResponse("Payment was successful");
            }

        
        public async Task<Responses> RefundPaymentAsync(int bookingId)
        {
            var booking = await _unitOfWork.Repository<Booking, int>().GetByIdAsync(bookingId);

            if (booking is null)
                return await Responses.FailurResponse("Booking not found!", System.Net.HttpStatusCode.NotFound);

            if (string.IsNullOrEmpty(booking.PaymentIntentId))
                return await Responses.FailurResponse("No Payment Intent ID associated with this booking!", System.Net.HttpStatusCode.BadRequest);

            try
            {
                var paymentIntentService = new PaymentIntentService();
                var paymentIntent = await paymentIntentService.GetAsync(booking.PaymentIntentId);

                if (paymentIntent == null)
                    return await Responses.FailurResponse("PaymentIntent not found.", System.Net.HttpStatusCode.BadRequest);

                if (string.IsNullOrEmpty(paymentIntent.LatestChargeId))
                    return await Responses.FailurResponse("No charge found to refund.", System.Net.HttpStatusCode.BadRequest);

                var refundService = new RefundService();
                var refundOptions = new RefundCreateOptions
                {
                    Charge = paymentIntent.LatestChargeId,
                    Amount = (long)(booking.TotalPrice * 100) // Full refund
                };

                var refund = await refundService.CreateAsync(refundOptions);

                booking.Status = BookingStatus.Canceled;
                _unitOfWork.Repository<Booking, int>().Update(booking);
                var result = await _unitOfWork.CompleteAsync();

                if (result <= 0)
                    return await Responses.FailurResponse("Failed to update booking status after refund.", System.Net.HttpStatusCode.InternalServerError);

                return await Responses.SuccessResponse(refund);
            }
            catch (StripeException ex)
            {
                return await Responses.FailurResponse($"Stripe error: {ex.Message}", System.Net.HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                return await Responses.FailurResponse($"An error occurred: {ex.Message}", System.Net.HttpStatusCode.InternalServerError);
            }
        }


    }
}
