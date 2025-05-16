using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyProject.Dto;
using MyProject.Service.interfac;
using MyProject.Utils;

namespace MyProject.Service.impl
{
    public class MessageService : IMessageService
    {
        private readonly ApplicationDbContext _dbContext;

        public MessageService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<GroupChatDto>> GetAllChatGroups(int userId)
        {
            var groups = await _dbContext.GroupChatMembers
            .Where(gm => gm.UserId == userId)
            .Select(gm => new GroupChatDto
            {
                Id = gm.GroupChat.Id,
                Name = gm.GroupChat.Name
            })
            .ToListAsync();

            return groups;
        }

        public async Task<List<MessageDto>> GetChatGroupMessages(int userId, int groupChatId)
        {
            var isMember = await _dbContext.GroupChatMembers
            .AnyAsync(m => m.GroupChatId == groupChatId && m.UserId == userId);

            if (!isMember)
            {
                return new List<MessageDto>(); // Hoặc throw exception tùy thiết kế
            }

            var messages = await _dbContext.Messages
                .Include(m => m.Sender)
                .Include(m => m.GroupChat)
                .Where(m => m.GroupChatId == groupChatId)
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    Content = m.Content,
                    SentAt = m.SentAt,
                    SenderId = m.SenderId,
                    SenderName = m.Sender.FullName,
                    GroupChatId = m.GroupChatId,
                    GroupChatName = m.GroupChat.Name
                })
                .ToListAsync();


            return messages;
        }

        public async Task<List<MessageDto>> GetPrivateMessages(int userId, int otherUserId)
        {
            var messages = await _dbContext.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m =>
                (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                (m.SenderId == otherUserId && m.ReceiverId == userId))
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                SentAt = m.SentAt,
                SenderId = m.SenderId,
                SenderName = m.Sender.FullName,
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver.FullName,
            })
            .ToListAsync();
            return messages;
        }
    }
}
