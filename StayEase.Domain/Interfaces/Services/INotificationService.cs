using StayEase.Domain.Entities;

namespace StayEase.Domain.Interfaces.Services
{
    public interface INotificationService
    {
        Task CreateAsync(Notification notification);
        Task<List<Notification>> GetByUserAsync(string email);
        Task UpdateAsync(Notification notification); 
    }
}