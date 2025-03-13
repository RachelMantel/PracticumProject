using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneYourMood.Api.PostModels;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.InterfaceService;

namespace TuneYourMood.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // דורש אימות כברירת מחדל לכל הפעולות
    public class SongController(IService<SongDto> songService, IMapper mapper, IS3Service s3Service) : ControllerBase
    {
        private readonly IService<SongDto> _songService = songService;
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
            songDto = await _songService.addAsync(songDto);
            return Ok(songDto);
        }

        // עדכון שיר לפי ID
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
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

        //[HttpPost("upload")]
        //[Consumes("multipart/form-data")]
        //public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //        return BadRequest("No file uploaded.");

        //    // Generate a unique file name (to prevent overwriting files with the same name)
        //    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

        //    // נניח שאתה משתמש בשירות S3 שהגדרת קודם לכן
        //    var uploadResult = await _s3Service.UploadFileAsync(file, fileName);
        //    if (uploadResult)
        //    {
        //        // משתמשים ב-BucketName מתוך השירות
        //        return Ok(new { FileUrl = $"https://{_s3Service.BucketName()}.s3.amazonaws.com/{fileName}" });
        //    }
        //    else
        //    {
        //        return StatusCode(500, "File upload failed.");
        //    }
        //}


        // ⬇️ קבלת URL להורדת קובץ מה-S3
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }
    }
}
