namespace StayEase.Domain.Interfaces.Services
{
    public interface IPaymentService
    {
        Task<Responses> CreatePaymentIntentAsync(string currency, int bookingId);
        Task<Responses> CreateCheckoutSessioinAsync(int bookingId);
        Task<Responses> RefundPaymentAsync(int bookingId);
        Task<Responses> PaymentSuccessAsync(int bookingId);
        Task<Responses> PaymentCancelAsync(int bookingId);
    }
}
