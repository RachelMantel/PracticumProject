using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
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

        public async Task<List<SongEntity>> GetSongsByUserId(int userId)
        {
            return await _dbset.Where(song => song.UserId == userId).ToListAsync();
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
        // פונקציה לשליפת כל השירים לפי Mood
        public async Task<List<SongEntity>> GetSongsByMoodAsync(string mood)
        {
            return await _context.songsList
                .Where(song => song.mood_category != null && song.mood_category.ToLower() == mood.ToLower())
                .ToListAsync();
        }

    }
}
