namespace StayEase.Domain.DataTransferObjects.Booking
{
    public class BookingToCreateDTO
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public string PropertyId { get; set; }
    }
}
