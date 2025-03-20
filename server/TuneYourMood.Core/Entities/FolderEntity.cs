using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TuneYourMood.Core.Entities
{
    [Table("Folders")]
    public class FolderEntity
    {
        [Key]
        public int Id { get; set; }

        public int parentId { get; set; }

        public string FolderName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

        public UserEntity User { get; set; }

        public List<SongEntity> Songs { get; set; } = new List<SongEntity>();

        public FolderEntity()
        {

        }

        public FolderEntity(int id, string albumName, DateTime createdAt, int userId, UserEntity user)
        {
            Id = id;
            FolderName = albumName;
            CreatedAt = createdAt == null ? DateTime.Now : createdAt;
            UserId = userId;
            User = user;
            parentId = -1;
        }
    }
}
