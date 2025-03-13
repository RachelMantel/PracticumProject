using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.Entities;
using TuneYourMood.Core.InterfaceRepository;

namespace TuneYourMood.Data.Repositories
{
    public class SongRepository : Repository<SongEntity>, ISongRepository
    {
        readonly DbSet<SongEntity> _dbset;
        private readonly DataContext _context;
        public SongRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<SongEntity>();
            _context = dataContext;
        }
        public async Task<IEnumerable<SongEntity>> GetFullAsync()
        {
            return await _dbset.ToListAsync();
        }

        public List<SongEntity> GetSongsByUserId(int userId)
        {
            return  _dbset.Where(song => song.UserId == userId) .ToList();
        }

        public async Task<SongEntity> UploadSongAsync(SongEntity song)
        {
            await _context.songsList.AddAsync(song);
            await _context.SaveChangesAsync();
            return song;
        }

        public async Task<string> GetSongUrlAsync(int songId)
        {
            var song = await _context.songsList.FindAsync(songId);
            return song?.FilePath;
        }
    }
}
