using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Core.InterfaceRepository
{
    public interface IFolderRepository:IRepository<FolderEntity>
    {
        public Task<IEnumerable<FolderEntity>> GetFullAsync();

        public Task<List<FolderEntity>> GetFoldersByUserId(int userId);

        public Task<List<SongEntity>> GetSongsByFolder(int folderId);
        
        public void AddSongToFolder(int folderId, SongEntity song);
        public void DeleteSongFromFolder(int folderId, SongEntity song);

    }
}
