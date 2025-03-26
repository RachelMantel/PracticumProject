using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TuneYourMood.Api.PostModels;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.InterfaceService;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TuneYourMood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, IMapper mapper) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IMapper _mapper = mapper;

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var result = _authService.Login(model.UserNameOrEmail, model.Password);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return Unauthorized(result.ErrorMessage);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserPostModel user)
        {
            if (user == null)
                return BadRequest("User data is required.");

            var userDto = _mapper.Map<UserDto>(user);
            user.DateRegistration = DateTime.Today;
            var result = await _authService.Register(userDto);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }

            return BadRequest(result.ErrorMessage);
        }


    }

    public class LoginModel
    {
        public string UserNameOrEmail { get; set; }
        public string Password { get; set; }
    }
}
