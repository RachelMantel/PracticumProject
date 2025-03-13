using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.InterfaceRepository;

namespace TuneYourMood.Data.Repositories
{
    public class RepositoryManager:IRepositoryManager
    {
        private readonly DataContext _context;

        public IUserRepository _userRepository { get; set; }
        public ISongRepository _songRepository { get; set; }

        public RepositoryManager(DataContext context,
            IUserRepository userRepository,
            ISongRepository songRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _songRepository = songRepository;
        }

        public void save()
        {
            _context.SaveChanges();
        }
    }
}
