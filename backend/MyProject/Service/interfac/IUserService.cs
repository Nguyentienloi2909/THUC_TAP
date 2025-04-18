using Microsoft.AspNetCore.Identity.Data;
using MyProject.Dto;

namespace MyProject.Service.interfac
{
    public interface IUserService
    {
        Task<Response> Login(Dto.LoginRequest request);
        Task<Response> Register(UserDto request);
        Task<List<UserDto>> GetAllUser();
        Task<UserDto?> GetUserById(int id);
        Task<UserDto> UpdateUserById(int id, UserDto dto);
        Task<bool> DeleteUserById(int id);
    }
}
