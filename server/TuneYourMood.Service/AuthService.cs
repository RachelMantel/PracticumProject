using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;
using TuneYourMood.Core.InterfaceRepository;
using TuneYourMood.Core.InterfaceService;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace TuneYourMood.Service
{
    public class AuthService(IConfiguration configuration, IRepositoryManager repositoryManager) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly IRepositoryManager _repositoryManager = repositoryManager;

        public string GenerateJwtToken(UserEntity user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in user.Roles?.Select(r => r.RoleName) ?? Enumerable.Empty<string>())
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }


            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateUser(string usernameOrEmail, string password, out string[] roles, out UserEntity user)
        {
            roles = null;
            user = _repositoryManager._userRepository.GetUserWithRoles(usernameOrEmail);

            if (user != null &&user.Password==password)
            {
                roles = user.Roles.Select(r => r.RoleName).ToArray();
                return true;
            }

            return false;
        }


        public Result<LoginResponseDto> Login(string usernameOrEmail, string password)
        {
            if (ValidateUser(usernameOrEmail, password, out var roles, out var user))
            {
                var token = GenerateJwtToken(user);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                   Password = user.Password
                };
                var response = new LoginResponseDto
                {
                    User = userDto,
                    Token = token
                };
                return Result<LoginResponseDto>.Success(response);
            }

            return Result<LoginResponseDto>.Failure("Invalid username or password.");
        }

        //public async Task<Result<bool>> Register(UserDto userDto)
        //{
        //    var user = new UserEntity
        //    {
        //        Name = userDto.Name,
        //        Email = userDto.Email,
        //        Password = userDto.Password,
        //        DateRegistration = DateTime.UtcNow,
        //    };

        //    var users = await _repositoryManager._userRepository.GetAsync();
        //    if (users.Any(u =>
        //            u.Name == user.Email ||
        //            u.Email == user.Email ||
        //            u.Email == user.Name))
        //    {
        //        return Result<bool>.Failure("Username or email already exists.");
        //    }

        //    var result = await _repositoryManager._userRepository.AddAsync(user);
        //    if (result == null)
        //    {
        //        return Result<bool>.Failure("Failed to register user.");
        //    }

        //     _repositoryManager.save();
        //    return Result<bool>.Success(true);
        //}

        public async Task<Result<LoginResponseDto>> Register(UserDto userDto)
        {
            var user = new UserEntity
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password,
                DateRegistration = DateTime.UtcNow,
            };

            var users = await _repositoryManager._userRepository.GetAsync();
            if (users.Any(u =>
                    u.Name == user.Email ||
                    u.Email == user.Email ||
                    u.Email == user.Name))
            {
                return Result<LoginResponseDto>.Failure("Username or email already exists.");
            }

            var result = await _repositoryManager._userRepository.AddAsync(user);
            if (result == null)
            {
                return Result<LoginResponseDto>.Failure("Failed to register user.");
            }

            _repositoryManager.save();

            // יצירת טוקן למשתמש שנרשם
            var token = GenerateJwtToken(user);

            var userDtoResponse = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password
            };

            var response = new LoginResponseDto
            {
                User = userDtoResponse,
                Token = token
            };

            return Result<LoginResponseDto>.Success(response);
        }

    }
}
