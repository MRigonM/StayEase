using Microsoft.AspNetCore.Http;

namespace StayEase.Domain.Interfaces.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(string mailTo, string subject, string body, IList<IFormFile>? attachedFiles = null);
    }
}
