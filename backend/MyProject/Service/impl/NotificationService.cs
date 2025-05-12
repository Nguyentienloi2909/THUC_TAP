using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyProject.Dto;
using MyProject.Entity.Enum;
using MyProject.Hubs;
using MyProject.Service.interfac;
using MyProject.Utils;
using System;

namespace MyProject.Service.impl
{
    public class NotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ApplicationDbContext _dbContext;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public NotificationService(IHubContext<NotificationHub> hubContext, ApplicationDbContext dbContext, IUserService userService, IEmailService emailService)
        {
            _hubContext = hubContext;
            _dbContext = dbContext;
            _userService = userService;
            _emailService = emailService;
        }

        public async Task<NotificationDto> SendNotificationAsync([FromBody] NotificationDto request)
        {
            //1.Lưu vào database
            var notification = new Entity.Notification
            {
                Title = request.Title,
                Description = request.Description,
                SentAt = DateTime.Now,
                Display = true
            };
            _dbContext.Notifications.Add(notification);
            await _dbContext.SaveChangesAsync();

            //2.Gửi thông báo đến tất cả client
            var message = new NotificationDto
            {
                Id = notification.Id,
                Title = notification.Title,
                Description = notification.Description,
                SentAt = notification.SentAt
            };
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);

            // 3. Gửi email đến tất cả người dùng
            var allUsers = await _userService.GetAllUser();

            var emailTasks = allUsers.Select(user =>
                _emailService.SendEmailAsync(new EmailRequest
                {
                    To = user.Email,
                    Subject = $"📢 {notification.Title}",
                    Description = notification.Description
                })
            );

            await Task.WhenAll(emailTasks);
            return message;
        }

        public async Task<List<NotificationDto>> GetAllNotificationsAsync()
        {
            var notifications = await _dbContext.Notifications
                .Where(n => n.Display == true)
                .OrderByDescending(n => n.SentAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Description = n.Description,
                    SentAt = n.SentAt
                }).ToListAsync();

            return notifications;
        }
    }
}
