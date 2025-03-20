using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TuneYourMood.Core.Entities;

namespace TuneYourMood.Core.DTOs
{
    public class FolderDto
    {
        public int Id { get; set; }

        public int parentId { get; set; }

        public string FolderName { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

    }
}
