using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Core.InterfaceRepository
{
    public interface IUserRepository:IRepository<UserEntity>
    {
        public Task<IEnumerable<UserEntity>> GetFullAsync();

        IEnumerable<RoleEntity> GetUserRoles(int userId);
        UserEntity GetUserWithRoles(string usernameOrEmail);
    }
}

