namespace TuneYourMood.Api.PostModels
{
    public class SongPostModel
    {

        public int UserId { get; set; }

        public string SongName { get; set; }

        public string Artist { get; set; }

        public string FilePath { get; set; }
        public string mood_category { get; set; }

        public int FolderId { get; set; }
    }
}
