using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Data
{
    public class DataContext:DbContext
    {
        public DbSet<UserEntity> usersList { get; set; }
        public DbSet<SongEntity> songsList { get; set; }

        public DbSet<RoleEntity> rolesList { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.LogTo(mesege => Console.Write(mesege));
        }
    }
}
