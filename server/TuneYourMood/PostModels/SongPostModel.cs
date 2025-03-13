namespace TuneYourMood.Api.PostModels
{
    public class SongPostModel
    {
        public DateTime DateAdding { get; set; }

        public int UserId { get; set; }

        public string SongName { get; set; }

        public string Artist { get; set; }

        public string Playlist_name { get; set; }

        public string FilePath { get; set; }
        public string mood_category { get; set; }
    }
}
