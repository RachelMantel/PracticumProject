using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;


namespace TuneYourMood.Core.InterfaceRepository
{
    public interface ISongRepository : IRepository<SongEntity>
    {
        public Task<IEnumerable<SongEntity>> GetFullAsync();

        public Task<List<SongEntity>> GetSongsByUserId(int userId);


        Task<SongEntity> UploadSongAsync(SongEntity song);
        Task<string> GetSongUrlAsync(int songId);

        public Task<List<SongEntity>> GetSongsByMoodAsync(string mood);
    }
}
