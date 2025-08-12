using StayEase.Domain.DataTransferObjects.Booking;

namespace StayEase.Domain.Interfaces.Services
{
    public interface IBookService
    {
        Task<Responses> GetBookingsByUserId(string email);
        Task<Responses> GetBookingById(int bookingId);
        Task<Responses> CreateBookingByPropertyId(string email, BookingToCreateDTO bookDTO);
        Task<Responses> UpdateBookingByPropertyId(int bookingId, BookingToUpdateDTO bookDTO);
        Task<Responses> DeleteBookingById(int bookingId);
    }
}
