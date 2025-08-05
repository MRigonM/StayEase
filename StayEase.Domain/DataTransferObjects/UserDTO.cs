namespace StayEase.Domain.DataTransferObjects
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string PhoneNumber { get; set; }
        public string? profileImage { get; set; }
    }
}
