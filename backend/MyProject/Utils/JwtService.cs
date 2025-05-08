using Microsoft.IdentityModel.Tokens;
using MyProject.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyProject.Utils
{
    public class JwtService
    {
        private readonly string _SECRETKEY = "SuperSecretkey12345!@#$%^&*()_+6789";

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.Role, user.Role.RoleName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_SECRETKEY));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "https://192.168.1.145:7247",
                audience: "https://192.168.1.145:7247",
                claims: claims,
                expires: DateTime.Now.AddHours(1), // token valid for 1 hour
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
