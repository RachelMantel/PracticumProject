using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.InterfaceService;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using TuneYourMood.Service;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FolderController(IFolderService folderService, IMapper mapper) : ControllerBase
    {
        private readonly IFolderService _folderService = folderService;
        private readonly IMapper _mapper = mapper;

        // GET: api/Folder
        [HttpGet]
        public async Task<ActionResult<List<FolderDto>>> Get()
        {
            return Ok(await _folderService.getallAsync());
        }

        // GET api/Folder/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FolderDto>> Get(int id)
        {
            var folder = await _folderService.getByIdAsync(id);
            if (folder == null)
                return NotFound();

            return Ok(folder);
        }

        // GET api/Folder/user - מחזיר את התיקיות של המשתמש שמחובר
        [HttpGet("user")]
        public async Task<ActionResult<List<FolderDto>>> GetFoldersByUser()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await _folderService.GetFoldersByUserId(userId));
        }

        [HttpGet("songs/{id}")]
        public async Task<ActionResult<List<SongDto>>> GetSongsByFolder(int id)
        {
            return Ok(await _folderService.GetSongsByFolder(id));
        }

        //הוספת שיר לתקיה
        [HttpPost("songs/{folderId}")]
        public async Task<ActionResult> AddSongToFolder(int folderId, [FromBody] SongDto song)
        {
            if (song == null)
            {
                return BadRequest(new { message = "Song data is required." });
            }

            try
            {
                _folderService.AddSongToFolder(folderId, song);
                return Ok(new { message = "Song added to folder successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        //מחיקת שיר מתקיה
        [HttpDelete("songs/{folderId}")]
        public ActionResult DeleteSongFromFolder(int folderId, [FromBody] SongDto song)
        {
            if (song == null)
            {
                return BadRequest(new { message = "Song data is required." });
            }

            try
            {
                _folderService.DeleteSongFromFolder(folderId, song);
                return Ok(new { message = "Song deleted from folder successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST api/Folder - יצירת תיקייה חדשה
        [HttpPost]
        public async Task<ActionResult<FolderDto>> Post([FromBody] FolderDto folder)
        {
            var createdFolder = await _folderService.addAsync(folder);
            return Ok(createdFolder);
        }

        // PUT api/Folder/{id} - עדכון תיקייה
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] FolderDto folder)
        {
            var updatedFolder = await _folderService.updateAsync(id, folder);
            if (updatedFolder == null)
                return NotFound();

            return Ok(updatedFolder);
        }

        // DELETE api/Folder/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _folderService.deleteAsync(id);
            if (!deleted)
                return NotFound();

            return Ok();
        }


    }
}
