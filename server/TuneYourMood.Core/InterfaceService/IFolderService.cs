using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Core.InterfaceService
{
    public interface IFolderService : IService<FolderDto>
    {
        public List<FolderEntity> GetFoldersByUserId(int userId);
        //public List<SongEntity> GetSongsByFolderId(int userId);
        public List<SongEntity> GetSongsByFolder(int folderId);
        public void AddSongToFolder(int folderId, SongDto song);
        public void DeleteSongFromFolder(int folderId, SongDto song);

    }
}
