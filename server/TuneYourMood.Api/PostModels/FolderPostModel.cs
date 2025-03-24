using TuneYourMood.Core.Entities;

namespace TuneYourMood.Api.PostModels
{
    public class FolderPostModel
    {
        public int parentId { get; set; }

        public string FolderName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

    }
}
