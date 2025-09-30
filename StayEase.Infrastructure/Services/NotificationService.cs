using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using StayEase.Domain.Entities;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IMongoCollection<Notification> _notifications;

        public NotificationService(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("MongoDb");
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase("StayEaseNotifications"); 
            _notifications = database.GetCollection<Notification>("Notifications");
        }

        public async Task CreateAsync(Notification notification)
        {
            await _notifications.InsertOneAsync(notification);
        }

        public async Task<List<Notification>> GetByUserAsync(string email)
        {
            return await _notifications.Find(n => n.Email == email).ToListAsync();
        }
        
        public async Task UpdateAsync(Notification notification)
        {
            await _notifications.ReplaceOneAsync(n => n.Id == notification.Id, notification);
        }
    }
}