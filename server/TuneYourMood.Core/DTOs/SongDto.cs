using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TuneYourMood.Core.DTOs
{
    public class SongDto
    {
        public int Id { get; set; }

        public DateTime DateAdding { get; set; }

        public int UserId { get; set; }

        public string SongName { get; set; }

        public string Artist { get; set; }

        public string? Playlist_name { get; set; }

        public string FilePath { get; set; }
        public string mood_category { get; set; }
    }
}
