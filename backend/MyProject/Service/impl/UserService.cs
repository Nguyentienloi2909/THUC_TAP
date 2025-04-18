using Microsoft.EntityFrameworkCore;
using MyProject.Dto;
using MyProject.Entity;
using MyProject.Mappers;
using MyProject.Service.interfac;
using MyProject.Utils;
using System.IdentityModel.Tokens.Jwt;

namespace MyProject.Service.impl
{
    public class UserService : IUserService
    {
        private readonly JwtService _jwtService;
        private readonly ApplicationDbContext _dbContext;
        public UserService(ApplicationDbContext dbContext, JwtService jwtService)
        {
            this._dbContext = dbContext;
            this._jwtService = jwtService;
        }

        public async Task<bool> DeleteUserById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<UserDto>> GetAllUser()
        {
            var users = await _dbContext.Users
                .Include(u => u.Role)
                .Include(u => u.Group)
                .ToListAsync();

            return users.Select(u => u.ToDto()).ToList();
        }

        public async Task<UserDto?> GetUserById(int id)
        {
            var user = await _dbContext.Users
                .Include(u => u.Role)
                .Include(u => u.Group)
                .FirstOrDefaultAsync(u => u.Id == id);

            return user?.ToDto();
        }

        public async Task<Response> Login(LoginRequest request)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
                if (user == null)
                    return new Response { statusCode = 404, message = "User not found" };

                if (!BCrypt.Net.BCrypt.Verify(request.PasswordHash, user.PasswordHash))
                    return new Response { statusCode = 401, message = "Invalid password" };

                // Lấy Role và Group nếu cần set cho GenerateToken
                var role = await _dbContext.Roles.FindAsync(user.RoleId);
                var group = user.GroupId.HasValue ? await _dbContext.Groups.FindAsync(user.GroupId) : null;

                user.Role = role!;
                user.Group = group;

                var token = _jwtService.GenerateToken(user);

                return new Response
                {
                    statusCode = 200,
                    message = "Success",
                    token = token,
                    expirationTime = DateTime.Now.AddHours(1).ToString("yyyy-MM-dd HH:mm:ss"), // Thay đổi thời gian hết hạn nếu cần
                    role = role?.Name,
                };
            }
            catch (Exception ex)
            {
                return new Response
                {
                    statusCode = 500,
                    message = $"An error occurred during login: {ex.Message}"
                };
            }
        }



        public async Task<Response> Register(UserDto request)
        {
            try
            {
                // Kiểm tra username đã tồn tại chưa
                var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
                if (existingUser != null)
                {
                    return new Response { statusCode = 400, message = "Username already exists" };
                }

                string password = GenerateRandomPassword();
                Console.WriteLine($"Generated Password: {password}");

                // Tạo người dùng mới
                var newUser = new User
                {
                    Username = request.Username,
                    PhoneNumber = request.PhoneNumber,
                    Email = request.Email,
                    BasicSalary = request.BasicSalary,
                    SalaryFactor = request.SalaryFactor,
                    Status = request.Status,
                    RoleId = request.RoleId,
                    GroupId = request.GroupId,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password) // Ví dụ hardcode (nên sửa lại để nhận password từ request)
                };

                Role role = await _dbContext.Roles.FindAsync(request.RoleId);
                if (role == null)
                {
                    return new Response { statusCode = 400, message = "Role not found" };
                }
                Group group = await _dbContext.Groups.FindAsync(request.GroupId);
                if (group == null)
                {
                    return new Response { statusCode = 400, message = "Group not found" };
                }

                _dbContext.Users.Add(newUser);
                await _dbContext.SaveChangesAsync();

                // Tạo token sau khi đăng ký thành công
                var token = _jwtService.GenerateToken(newUser);

                return new Response
                {
                    statusCode = 200,
                    message = "User registered successfully",
                    token = token,
                    expirationTime = DateTime.Now.AddHours(1).ToString("yyyy-MM-dd HH:mm:ss"), // Thay đổi thời gian hết hạn nếu cần
                    role = role.Name,
                };
            }
            catch (Exception ex)
            {
                return new Response
                {
                    statusCode = 500,
                    message = $"Registration failed: {ex.Message}"
                };
            }
        }


        public async Task<UserDto> UpdateUserById(int id, UserDto dto)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null)
                throw new Exception("User not found");

            user.Username = dto.Username;
            user.PhoneNumber = dto.PhoneNumber;
            user.Email = dto.Email;
            user.BasicSalary = dto.BasicSalary;
            user.SalaryFactor = dto.SalaryFactor;
            user.Status = dto.Status;
            user.RoleId = dto.RoleId;
            user.GroupId = dto.GroupId;

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();
            return user.ToDto();
        }

        public static string GenerateRandomPassword(int length = 10)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }
}
