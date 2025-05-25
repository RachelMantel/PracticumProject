using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TuneYourMood.Core.Entities
{
    [Table("Songs")]
    public class SongEntity
    {
        public int Id { get; set; }

        public DateTime DateAdding { get; set; }

        public int UserId { get; set; }

        public string SongName { get; set; }

        public string Artist { get; set; }

        public string FilePath { get; set; }
        public string mood_category { get; set; }
        public int FolderId { get; set; } = -1;

        public UserEntity User { get; set; }
        public SongEntity()
        {
            
        }
    }
}
