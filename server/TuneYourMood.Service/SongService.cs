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
    public class SongService(IRepositoryManager repositoryManager, IMapper mapper) : ISongService
    {
        private readonly IRepositoryManager _repositoryManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<SongDto>> getallAsync()
        {
            var songs = await _repositoryManager._songRepository.GetFullAsync();
            var songsDtos = _mapper.Map<List<SongDto>>(songs);
            return songsDtos;
        }

        public async Task<SongDto>? getByIdAsync(int id)
        {
            var song = await _repositoryManager._songRepository.GetByIdAsync(id);
            var songDtos = _mapper.Map<SongDto>(song);

            return songDtos;
        }

        public async Task<SongDto> addAsync(SongDto song)
        {
            if (song == null)
                return null;

            var songModel = _mapper.Map<SongEntity>(song);
            await _repositoryManager._songRepository.AddAsync(songModel);
            _repositoryManager.save();

            return _mapper.Map<SongDto>(song);

        }

        public async Task<SongDto> updateAsync(int id, SongDto song)
        {

            var songModel = _mapper.Map<SongEntity>(song);
            var help = await _repositoryManager._songRepository.UpdateAsync(id, songModel);
            if (help == null)
                return null;
            _repositoryManager.save();
            song = _mapper.Map<SongDto>(help);
            return song;
        }

        public async Task<bool> deleteAsync(int id)
        {
            var song = await _repositoryManager._songRepository.DeleteAsync(id);
            _repositoryManager.save();
            return song;

        }

        public async Task<SongDto> GetRandomSongByMoodAsync(string mood)
        {
            var songs = await _repositoryManager._songRepository.GetSongsByMoodAsync(mood);
            if (songs == null || !songs.Any())
                return null;

            // בחירת שיר רנדומלי מתוך השירים שמצאנו
            var randomSong = songs[new Random().Next(songs.Count)];

            // המרת SongEntity ל-SongDto באמצעות AutoMapper
            var songDto = _mapper.Map<SongDto>(randomSong);

            return songDto;
        }

        public List<SongDto> GetSongsByUserId(int userId)
        {
            // שליפת השירים מה-Repository על פי ה-userId
            var songs = _repositoryManager._songRepository.GetSongsByUserId(userId);

            // אם לא נמצאו שירים, החזר רשימה ריקה
            if (songs == null || !songs.Any())
            {
                return new List<SongDto>();
            }

            // המרת רשימת SongEntity ל-SongDto באמצעות AutoMapper
            var songDtos = _mapper.Map<List<SongDto>>(songs);

            return songDtos;
        }

        public List<SongEntity> GetSongsByFolderId(int folderId)
        {
            var folder = _repositoryManager._songRepository.GetSongsByFolderId(folderId);

            if (folder == null)
                return new List<SongEntity>(); // מחזיר רשימה ריקה אם התיקייה לא נמצאה

            return folder; // מחזיר את רשימת השירים או רשימה ריקה אם אין שירים
        }
    }
}

