using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;
using TuneYourMood.Core.InterfaceRepository;
using TuneYourMood.Core.InterfaceService;

namespace TuneYourMood.Service
{
    public class FolderService(IRepositoryManager repositoryManager, IMapper mapper) : IFolderService
    {
        private readonly IRepositoryManager _repositoryManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<FolderDto>> getallAsync()
        {
            var folders = await _repositoryManager._folderRepository.GetFullAsync();
            return _mapper.Map<List<FolderDto>>(folders);
        }

        public async Task<FolderDto>? getByIdAsync(int id)
        {
            var folder = await _repositoryManager._folderRepository.GetByIdAsync(id);
            return _mapper.Map<FolderDto>(folder);
        }

        public async Task<FolderDto> addAsync(FolderDto folder)
        {
            if (folder == null)
                return null;

            var folderModel = _mapper.Map<FolderEntity>(folder);
            await _repositoryManager._folderRepository.AddAsync(folderModel);
            _repositoryManager.save();

            return _mapper.Map<FolderDto>(folderModel);
        }

        public async Task<FolderDto> updateAsync(int id, FolderDto folder)
        {
            var folderModel = _mapper.Map<FolderEntity>(folder);
            var updatedFolder = await _repositoryManager._folderRepository.UpdateAsync(id, folderModel);
            if (updatedFolder == null)
                return null;

            _repositoryManager.save();
            return _mapper.Map<FolderDto>(updatedFolder);
        }

        public async Task<bool> deleteAsync(int id)
        {
            var deleted = await _repositoryManager._folderRepository.DeleteAsync(id);
            _repositoryManager.save();
            return deleted;
        }

        public List<FolderEntity> GetFoldersByUserId(int userId)
        {
            return _repositoryManager._folderRepository.GetFoldersByUserId(userId);
        }

        //public List<SongEntity> GetSongsByFolderId(int folderId)
        //{
        //    var folder = _repositoryManager._folderRepository.GetSongsByFolderId(folderId);

        //    if (folder == null)
        //        return new List<SongEntity>(); // מחזיר רשימה ריקה אם התיקייה לא נמצאה

        //    return folder; // מחזיר את רשימת השירים או רשימה ריקה אם אין שירים
        //}


    }
}
