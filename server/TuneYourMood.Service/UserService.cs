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
    public class UserService(IRepositoryManager repositoryManager, IMapper mapper) : IUserService
    {

        private readonly IRepositoryManager _repositoryManager=repositoryManager;
        private readonly IMapper _mapper=mapper;

        public async Task<IEnumerable<UserDto>> getallAsync()
        {
            var users = await _repositoryManager._userRepository.GetFullAsync();
            var usersDtos = _mapper.Map<List<UserDto>>(users);
            return usersDtos;
        }

        public async Task<UserDto>? getByIdAsync(int id)
        {
            var user =await _repositoryManager._userRepository.GetByIdAsync(id);
            var userDtos = _mapper.Map<UserDto>(user);

            return userDtos;
        }

        public async Task<UserDto> addAsync(UserDto user)
        {
            if (user == null)
                return null;

            var userModel = _mapper.Map<UserEntity>(user);
            await _repositoryManager._userRepository.AddAsync(userModel);
            _repositoryManager.save();

            return _mapper.Map<UserDto>(user);

        }

        public async Task<UserDto> updateAsync(int id, UserDto user)
        {

            var userModel = _mapper.Map<UserEntity>(user);
            var help = await _repositoryManager._userRepository.UpdateAsync(id, userModel);
            if (help == null)
                return null;
            _repositoryManager.save();
            user = _mapper.Map<UserDto>(help);
            return user;
        }

        public async Task<bool> deleteAsync(int id)
        {
            var user =await _repositoryManager._userRepository.DeleteAsync(id);
            _repositoryManager.save();
            return user;
        }

        public List<SongDto> GetSongsByUserId(int userId)
        {

            var songs = _repositoryManager._songRepository.GetSongsByUserId(userId);
            var songsList = _mapper.Map<List<SongDto>>(songs);

            return songsList;
        }

    }
}
