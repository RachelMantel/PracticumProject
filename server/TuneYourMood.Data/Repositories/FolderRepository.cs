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

        public List<FolderEntity> GetFoldersByUserId(int userId)
        {
            return _dbset.Where(f => f.UserId == userId).ToList();
        }

        public async Task<IEnumerable<FolderEntity>> GetFullAsync()
        {
            return await _dbset
                .Include(f => f.User)
                .Include(f => f.Songs)
                .ToListAsync();
        }

        //public List<SongEntity> GetSongsByFolderId(int folderId)
        //{
        //    if (_dbsetSongs == null)
        //    {
        //        return new List<SongEntity>(); // אם ה-dbsetSongs לא מאותחל
        //    }

        //    var songs = _dbsetSongs.Where(song => song.FolderId == folderId).ToList();
        //    return songs ?? new List<SongEntity>(); // אם כלום לא חזר, מחזיר רשימה ריקה
        //}


    }
}
