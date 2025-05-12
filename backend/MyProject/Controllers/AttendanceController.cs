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
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;
        private readonly IUserService _userService;

        public AttendanceController(IAttendanceService attendanceService, IUserService userService)
        {
            _attendanceService = attendanceService;
            _userService = userService;
        }


        [HttpGet("attendance")]
        public async Task<IActionResult> GetAttendance([FromQuery] int? month, [FromQuery] int? year)
        {
            var email = GetUsernameFromToken();
            var user = await _userService.GetMyInfo(email);
            if (user == null)
            {
                return Unauthorized(new { message = "Người dùng không tồn tại." });
            }

            try
            {
                var targetMonth = month ?? DateTime.Now.Month;
                var targetYear = year ?? DateTime.Now.Year;

                var attendances = await _attendanceService.GetAttendanceByUserIdInMonthAsync(user.Id ?? 0, targetMonth, targetYear);

                if (attendances == null || !attendances.Any())
                {
                    return NotFound(new { message = $"Không tìm thấy chấm công cho user: {user.FullName} trong tháng {targetMonth}/{targetYear}." });
                }

                return Ok(attendances);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }



        // Check-in
        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn()
        {
            try
            {
                var email = GetUsernameFromToken();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { message = "Username claim not found in token" });
                var user = await _userService.GetMyInfo(email);
                var (isSuccess, errorMessage) = await _attendanceService.CheckIn(user.Id ?? 0);

                if (!isSuccess)
                    return BadRequest(new { message = errorMessage });

                return Ok("Checked in successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while checking out: {ex.Message}");
            }
        }

        // Check-out
        [HttpPost("checkout")]
        public async Task<IActionResult> CheckOut(int userId)
        {
            try
            {
                var email = GetUsernameFromToken();
                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { message = "Username claim not found in token" });
                var user = await _userService.GetMyInfo(email);
                var (isSuccess, errorMessage) = await _attendanceService.CheckOut(user.Id ?? 0);

                if (!isSuccess)
                    return BadRequest(new { message = errorMessage });

                return Ok("Checked out successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while checking out: {ex.Message}");
            }
        }

        // Cập nhật nghỉ phép
        [HttpPost("leave/{userId}")]
        [Authorize(Roles = "ADMIN, LEADER")]
        public async Task<IActionResult> UpdateLeave(int userId, 
            [FromQuery] string status,
            [FromQuery] string note)
        {
            try
            {
                var (isSuccess, errorMessage) = await _attendanceService.UpdateStatus(userId, status ,note);

                if (!isSuccess)
                    return BadRequest(new { message = errorMessage });

                return Ok("status updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating leave: {ex.Message}");
            }
        }

        // Lấy tất cả bản ghi chấm công cho ngày hôm nay
        [HttpGet("today")]
        [Authorize(Roles = "ADMIN, LEADER")]
        public async Task<IActionResult> GetAllAttendancesForToday()
        {
            try
            {
                var attendances = await _attendanceService.GetAllAttendancesForToday();

                if (attendances == null || !attendances.Any())
                    return NotFound("No attendance records found for today.");

                return Ok(attendances);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching today's attendance: {ex.Message}");
            }
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
