using Microsoft.AspNetCore.Mvc;
using MyProject.Dto;

namespace MyProject.Service.interfac
{
    public interface IMessageService
    {
        Task<List<GroupChatDto>> GetAllChatGroups(int userId);
        Task<List<MessageDto>> GetPrivateMessages(int userId, int otherUserId);
        Task<List<MessageDto>> GetChatGroupMessages(int userId, int groupChatId);
    }
}
