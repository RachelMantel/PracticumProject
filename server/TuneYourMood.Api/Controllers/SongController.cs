using Amazon.S3.Model;
using Amazon.S3;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneYourMood.Api.PostModels;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.InterfaceService;
using TuneYourMood.Service;

namespace TuneYourMood.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // דורש אימות כברירת מחדל לכל הפעולות
    public class SongController(ISongService songService, IMapper mapper, IS3Service s3Service) : ControllerBase
    {
        private readonly ISongService _songService = songService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3Service _s3Service = s3Service;

        // שליפת כל השירים
        [HttpGet]
        public async Task<ActionResult<List<SongDto>>> Get()
        {
            return Ok(await _songService.getallAsync());
        }

        // שליפת שיר לפי ID
        [HttpGet("{id}")]
        public async Task<ActionResult<SongDto>> Get(int id)
        {
            var song = await _songService.getByIdAsync(id);
            if (song == null)
                return NotFound();

            return Ok(song);
        }

        // יצירת שיר חדש
        [HttpPost]
        public async Task<ActionResult<SongDto>> Post([FromBody] SongPostModel song)
        {
            var songDto = _mapper.Map<SongDto>(song);
            songDto.DateAdding = DateTime.Today;
            songDto = await _songService.addAsync(songDto);
            return Ok(songDto);
        }

        // עדכון שיר לפי ID
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] SongPostModel song)
        {
            var songDto = _mapper.Map<SongDto>(song);
            songDto = await _songService.updateAsync(id, songDto);
            return Ok(songDto);
        }

        // מחיקת שיר
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (!await _songService.deleteAsync(id))
                return NotFound();
            return Ok();
        }

        // ⬆️ קבלת URL להעלאת קובץ ל-S3
        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");

            var url = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);
            return Ok(new { url });
        }


        // ⬇️ קבלת URL להורדת קובץ מה-S3
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }


        [HttpGet("random-song-by-mood")]
        public async Task<ActionResult<SongDto>> GetRandomSongByMood([FromQuery] string mood)
        {
            if (string.IsNullOrEmpty(mood))
                return BadRequest("Missing mood");

            var song = await _songService.GetRandomSongByMoodAsync(mood);

            if (song == null)
                return NotFound("No songs found for the given mood");

            return Ok(song);
        }

        [HttpGet("user/{userId}")]
        public  IActionResult GetSongsByUserId(int userId)
        {
            var songs =  _songService.GetSongsByUserId(userId);

            if (songs == null || songs.Count == 0)
            {
                return NoContent(); 
            }

            return Ok(songs);
        }
    }
}
