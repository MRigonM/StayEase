using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayEase.Domain.Interfaces.Services;

namespace StayEase.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("GetMyNotifications")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email is null)
                return Unauthorized("Email claim not found");

            var notifications = await _notificationService.GetByUserAsync(email);
            return Ok(notifications);
        }

        [HttpPut("MarkAsRead/{id}")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email is null)
                return Unauthorized("Email claim not found");

            var notifications = await _notificationService.GetByUserAsync(email);
            var notification = notifications.FirstOrDefault(n => n.Id == id);
            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _notificationService.UpdateAsync(notification);

            return Ok("Notification marked as read");
        }
    }
}