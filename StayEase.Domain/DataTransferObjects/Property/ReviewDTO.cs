namespace StayEase.Domain.DataTransferObjects.Property
{
    public class ReviewDTO
    {
        public string Comment { get; set; } = string.Empty;
        public int Stars { get; set; }
        public string PropertyId { get; set; }
    }
}
