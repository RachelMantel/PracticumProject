using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.Entities;
using TuneYourMood.Core.InterfaceRepository;

namespace TuneYourMood.Data.Repositories
{
    public class UserRepository : Repository<UserEntity>, IUserRepository
    {
        readonly DbSet<UserEntity> _dbset;
        private readonly DataContext _context;

        public UserRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<UserEntity>();
            _context = dataContext;
        }

        public async Task<IEnumerable<UserEntity>> GetFullAsync()
        {
            return await _dbset
                .Include(u => u.SongList) 
                .ToListAsync();
        }


        public UserEntity GetUserWithRoles(string usernameOrEmail)
        {
            return _context.usersList
                .Include(u => u.Roles)
                .FirstOrDefault(u => u.Name == usernameOrEmail || u.Email == usernameOrEmail);
        }

        public IEnumerable<RoleEntity> GetUserRoles(int userId)
        {
            var user = _context.usersList
                .Include(u => u.Roles)
                .FirstOrDefault(u => u.Id == userId);

            return user?.Roles ?? Enumerable.Empty<RoleEntity>();
        }

    }
}
