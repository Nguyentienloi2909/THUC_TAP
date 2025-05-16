using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyProject.Service.interfac;
using System.IdentityModel.Tokens.Jwt;

namespace MyProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IUserService _userService;
        public MessageController(IMessageService messageService, IUserService userService)
        {
            _messageService = messageService;
            _userService = userService;
        }

        [HttpGet("chatGroups")]
        public async Task<IActionResult> GetAllGroups()
        {
            var username = GetUsernameFromToken();
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Invalid token" });
            var user = await _userService.GetMyInfo(username);
            var groups = await _messageService.GetAllChatGroups(user.Id ?? 0);
            return Ok(groups);
        }

        [HttpGet("chatGroups/{groupChatId}")]
        public async Task<IActionResult> GetGroupMessages(int groupChatId)
        {
            var username = GetUsernameFromToken();
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Invalid token" });
            var user = await _userService.GetMyInfo(username);

            var messages = await _messageService.GetChatGroupMessages(user.Id ?? 0, groupChatId);

            if (messages == null || !messages.Any())
            {
                return Forbid("Bạn không có quyền truy cập vào nhóm chat này hoặc không có tin nhắn nào.");
            }

            return Ok(messages);
        }

        [HttpGet("private/{otherUserId}")]
        public async Task<IActionResult> GetPrivateMessages(int otherUserId)
        {
            var username = GetUsernameFromToken();
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Invalid token" });
            var user = await _userService.GetMyInfo(username);

            var messages = await _messageService.GetPrivateMessages(user.Id ?? 0, otherUserId);
            return Ok(messages);
        }


        private string? GetUsernameFromToken()
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(token)) return null;

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            return jsonToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        }

    }
}
