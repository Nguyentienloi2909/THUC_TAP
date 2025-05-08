using MyProject.Dto;

namespace MyProject.Service.interfac
{
    public interface IAttendanceService
    {
        Task<AttendanceDto?> GetAttendanceByUserId(int userId);
        public Task<(bool IsSuccess, string? ErrorMessage)> CheckIn(int userId);
        public Task<(bool IsSuccess, string? ErrorMessage)> CheckOut(int userId);
        public Task<(bool IsSuccess, string? ErrorMessage)> UpdateStatus(int userId, string status, string note = "");
        Task<List<AttendanceDto>> GetAllAttendancesForToday();
    }
}
