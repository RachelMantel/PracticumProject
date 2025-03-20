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
        public IFolderRepository _folderRepository { get; set; }

        public RepositoryManager(DataContext context,
            IUserRepository userRepository,
            ISongRepository songRepository,
            IFolderRepository folderRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _songRepository = songRepository;
            _folderRepository = folderRepository;
        }

        public void save()
        {
            _context.SaveChanges();
        }
    }
}
