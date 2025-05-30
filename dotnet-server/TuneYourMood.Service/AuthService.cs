﻿using Microsoft.Extensions.Configuration;
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
using Google.Apis.Auth;

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

            // הוספת כל תפקיד מה-DB כ-Claim
            foreach (var role in user.Roles?.Select(r => r.RoleName) ?? Enumerable.Empty<string>())
            {
                //claims.Add(new Claim(ClaimTypes.Role, role));
                claims.Add(new Claim("role", role));
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

            if (user != null && user.Password == password)
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
                    Password = user.Password,
                    Roles = roles.ToList()
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

        public async Task<Result<LoginResponseDto>> Register(UserDto userDto)
        {
            var user = new UserEntity
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password,
                DateRegistration = DateTime.UtcNow,
                Roles = userDto.Roles.Select(role => new RoleEntity { RoleName = role }).ToList()
            };

            var users = await _repositoryManager._userRepository.GetAsync();
            if (users.Any(u => u.Email == user.Email))
            {
                return Result<LoginResponseDto>.Failure("Username or email already exists.");
            }

            var result = await _repositoryManager._userRepository.AddAsync(user);
            if (result == null)
            {
                return Result<LoginResponseDto>.Failure("Failed to register user.");
            }

            _repositoryManager.save();

            var token = GenerateJwtToken(user);

            var userDtoResponse = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                Roles = user.Roles.Select(r => r.RoleName).ToList()
            };

            var response = new LoginResponseDto
            {
                User = userDtoResponse,
                Token = token
            };

            return Result<LoginResponseDto>.Success(response);
        }

        public async Task<Result<LoginResponseDto>> GoogleLogin(string googleToken)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { _configuration["Google:ClientId"] }
                });

                var users = await _repositoryManager._userRepository.GetAsync();
                var existingUser = users.FirstOrDefault(u => u.Email == payload.Email);

                if (existingUser != null)
                {
                    var token = GenerateJwtToken(existingUser);

                    var userDto = new UserDto
                    {
                        Id = existingUser.Id,
                        Name = existingUser.Name,
                        Email = existingUser.Email,
                        Password = existingUser.Password,
                        Roles = existingUser.Roles.Select(r => r.RoleName).ToList()
                    };

                    var response = new LoginResponseDto
                    {
                        User = userDto,
                        Token = token
                    };

                    return Result<LoginResponseDto>.Success(response);
                }
                else
                {
                    var randomPassword = Guid.NewGuid().ToString("N")[..8]; 

                    var newUser = new UserEntity
                    {
                        Name = payload.Name,
                        Email = payload.Email,
                        Password = randomPassword, 
                        DateRegistration = DateTime.UtcNow,
                        Roles = new List<RoleEntity> { new RoleEntity { RoleName = "User" } }
                    };

                    var result = await _repositoryManager._userRepository.AddAsync(newUser);
                    if (result == null)
                    {
                        return Result<LoginResponseDto>.Failure("Failed to register user with Google.");
                    }

                    _repositoryManager.save();

                    var token = GenerateJwtToken(newUser);

                    var userDto = new UserDto
                    {
                        Id = newUser.Id,
                        Name = newUser.Name,
                        Email = newUser.Email,
                        Password = newUser.Password,
                        Roles = newUser.Roles.Select(r => r.RoleName).ToList()
                    };

                    var response = new LoginResponseDto
                    {
                        User = userDto,
                        Token = token
                    };

                    return Result<LoginResponseDto>.Success(response);
                }
            }
            catch (InvalidJwtException)
            {
                return Result<LoginResponseDto>.Failure("Invalid Google token.");
            }
            catch (Exception ex)
            {
                return Result<LoginResponseDto>.Failure($"Google authentication failed: {ex.Message}");
            }
        }
    }
}
