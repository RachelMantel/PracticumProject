using TuneYourMood.Api.PostModels;

using AutoMapper;
using TuneYourMood.Core.DTOs;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Api
{
    public class MappingPostProfile:Profile
    {
        public MappingPostProfile()
        {
            CreateMap<UserPostModel, UserDto>();
            CreateMap<SongPostModel, SongDto>();

        }
    }
}
