using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.InterfaceService;
using TuneYourMood.Api.PostModels;

namespace TuneYourMood.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // מחייב אימות בכל הפונקציות, אפשר גם לשים ספציפית על פונקציות מסוימות
    public class UserController(IUserService userService, IMapper mapper) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IMapper _mapper = mapper;

        // GET: api/User
        [HttpGet]
        [Authorize(Roles = "Admin")] // רק אדמין יכול לקבל את כל המשתמשים
        public async Task<ActionResult<List<UserDto>>> Get()
        {
            return Ok(await _userService.getallAsync());
        }

        // GET api/User/songs - מביא את השירים של המשתמש שמחובר
        [HttpGet("songs")]
        public ActionResult<List<SongDto>> GetSongsByUser()
        {
            // שליפת ה-Id של המשתמש מתוך ה-Token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(_userService.GetSongsByUserId(userId));
        }

        // GET api/User/{id}
        [HttpGet("{id}")]
        //[Authorize(Roles = "Admin")] // רק אדמין יכול לשלוף משתמש לפי ID
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var user = await _userService.getByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST api/User - רישום משתמש חדש
        [HttpPost]
        [AllowAnonymous] // כולם יכולים להירשם
        public async Task<ActionResult<bool>> Register([FromBody] UserPostModel user)
        {
            var userDto = _mapper.Map<UserDto>(user);
            userDto = await _userService.addAsync(userDto);
            return Ok(userDto);
        }

        // PUT api/User/{id} - עדכון משתמש מחובר
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UserPostModel user)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var userRole = User.FindFirstValue(ClaimTypes.Role); // התפקיד של המשתמש

            // לבדוק שהמשתמש מעדכן רק את עצמו, או שהוא אדמין
            if (userId != id && userRole != "Admin")
            {
                return Forbid(); // 403 - אין הרשאה
            }

            var userDto = _mapper.Map<UserDto>(user);
            userDto = await _userService.updateAsync(id, userDto);

            return Ok(userDto);
        }


        // DELETE api/User/{id}
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")] // רק אדמין יכול למחוק משתמש
        public async Task<ActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var userRole = User.FindFirstValue(ClaimTypes.Role); // התפקיד של המשתמש

            // לוודא שהמשתמש מוחק רק את עצמו, אלא אם כן הוא אדמין
            if (userId != id && userRole != "Admin")
            {
                return Forbid(); // 403 - אין הרשאה
            }

            if (!await _userService.deleteAsync(id))
                return NotFound();

            return Ok();
        }
    }
}
