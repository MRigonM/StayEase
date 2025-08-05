using Microsoft.AspNetCore.Http;

namespace StayEase.Domain.DataTransferObjects.Identity
{
    public class UpdateUserDTO
    {
        public string FirstName { get; set; }
        public string MiddlName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public IFormFile? ProfileImage { get; set; }

    }
}
