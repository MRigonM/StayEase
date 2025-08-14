namespace StayEase.Domain.DataTransferObjects.Booking
{
    public class BookingToUpdateDTO
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
    }
}
