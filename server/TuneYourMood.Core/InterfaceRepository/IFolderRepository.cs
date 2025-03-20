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

        public List<FolderEntity> GetFoldersByUserId(int userId);

        //public List<SongEntity> GetSongsByFolderId(int userId);

    }
}
