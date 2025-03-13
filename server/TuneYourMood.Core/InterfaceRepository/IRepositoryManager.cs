using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TuneYourMood.Core.InterfaceRepository
{
    public interface IRepositoryManager
    {
        IUserRepository _userRepository { get; set; }
        ISongRepository _songRepository { get; set; }
        void save();

    }
}
