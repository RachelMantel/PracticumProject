using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.DTOs;

namespace TuneYourMood.Core.InterfaceService
{
    public interface IUserService:IService<UserDto>
    {
        List<SongDto> GetSongsByUserId(int userId);

    }
}
