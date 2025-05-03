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
    public class FolderRepository : Repository<FolderEntity>, IFolderRepository
    {

        readonly DbSet<FolderEntity> _dbset;

        private readonly DataContext _context;

        public FolderRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<FolderEntity>();
            _context = dataContext;
        }

        public async Task<List<FolderEntity>> GetFoldersByUserId(int userId)
        {
            return await _dbset.Where(f => f.UserId == userId).ToListAsync();
        }

        public async Task<IEnumerable<FolderEntity>> GetFullAsync()
        {
            return await _dbset
                .Include(f => f.User)
                .Include(f => f.Songs)
                .ToListAsync();
        }

        public async Task<List<SongEntity>> GetSongsByFolder(int folderId)
        {
            var folder =await _context.foldersList
                .Include(f => f.Songs)  // טוען את השירים יחד עם התיקייה
                .FirstOrDefaultAsync(f => f.Id == folderId);

            if (folder == null)
            {
                return new List<SongEntity>();
            }

            return folder.Songs.ToList();
        }

        public void AddSongToFolder(int folderId, SongEntity song)
        {
            var folder = _context.foldersList
                .FirstOrDefault(f => f.Id == folderId); 

            if (folder == null)
            {
                throw new Exception("Folder not found");
            }

            folder.Songs.Add(song);
            _context.SaveChanges();
        }

        public void DeleteSongFromFolder(int folderId, int songId)
        {
            var folder = _context.foldersList
                .FirstOrDefault(f => f.Id == folderId);

            var song = folder.Songs.FirstOrDefault(s => s.Id == songId);

            if (folder == null)
            {
                throw new Exception("Folder not found");
            }

            folder.Songs.Remove(song);
            _context.SaveChanges();
        }

    }
}
