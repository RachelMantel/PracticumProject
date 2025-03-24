using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Core.InterfaceService
{
    public interface ISongService: IService<SongDto>
    {
        public Task<SongDto> GetRandomSongByMoodAsync(string mood);
        public List<SongDto> GetSongsByUserId(int userId);

    }
}
