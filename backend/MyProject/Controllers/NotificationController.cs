using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyProject.Dto;
using MyProject.Entity;
using MyProject.Service.impl;

namespace MyProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("send")]
        //[Authorize(Policy = "ADMIN")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationDto request)
        {
            var result =  await _notificationService.SendNotificationAsync(request);
            return Ok(new { Status = "Notification Sent", Notification = result });
        }

        [HttpGet("all")]
        //[Authorize]
        public async Task<IActionResult> GetAllNotifications()
        {
            var notifications = await _notificationService.GetAllNotificationsAsync();
            return Ok(notifications);
        }
    }
}
