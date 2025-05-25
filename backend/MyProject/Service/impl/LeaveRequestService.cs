using Microsoft.EntityFrameworkCore;
using MyProject.Dto;
using MyProject.Entity.Enum;
using MyProject.Entity;
using MyProject.Service.interfac;
using MyProject.Utils;

namespace MyProject.Service.impl
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly ApplicationDbContext _dbContext;

        public LeaveRequestService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddLeaveRequestAsync(LeaveRequestDto dto)
        {
            if (dto.SenderId == null)
                return false;

            if (dto.EndDate < dto.StartDate)
                return false;

            var leaveRequest = new LeaveRequest
            {
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Reason = dto.Reason,
                SenderId = dto.SenderId.Value,
                Status = StatusLeave.Pending,
                Display = true
            };

            _dbContext.LeaveRequests.Add(leaveRequest);
            await _dbContext.SaveChangesAsync();

            return true; // Ensure all code paths return a value
        }

        public async Task<bool> ApproveLeaveRequestAsync(int leaveRequestId, int acceptorId)
        {
            var leaveRequest = await _dbContext.LeaveRequests.FindAsync(leaveRequestId);
            if (leaveRequest == null)
                return false;

            // Kiểm tra trạng thái có thể duyệt được (ví dụ chỉ duyệt khi đang Pending)
            if (leaveRequest.Status != StatusLeave.Pending)
                return false;

            leaveRequest.Status = StatusLeave.Approved;
            leaveRequest.AcceptorId = acceptorId;

            _dbContext.LeaveRequests.Update(leaveRequest);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelLeaveRequestAsync(int leaveRequestId, int acceptorId)
        {
            var leaveRequest = await _dbContext.LeaveRequests.FindAsync(leaveRequestId);
            if (leaveRequest == null)
                return false;
            if(acceptorId != null)
            {
                leaveRequest.AcceptorId = acceptorId;
            }

            leaveRequest.Status = StatusLeave.Rejected;
            _dbContext.LeaveRequests.Update(leaveRequest);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
