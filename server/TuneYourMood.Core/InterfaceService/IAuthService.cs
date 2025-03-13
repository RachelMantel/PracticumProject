using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Core.InterfaceService
{
    public interface IAuthService
    {
        string GenerateJwtToken(UserEntity user);
        bool ValidateUser(string usernameOrEmail, string password, out string[] roles, out UserEntity user);
        Result<LoginResponseDto> Login(string usernameOrEmail, string password);
        Task<Result<LoginResponseDto>> Register(UserDto userDto);
    }
}
