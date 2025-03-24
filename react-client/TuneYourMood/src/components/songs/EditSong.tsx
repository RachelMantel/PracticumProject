import { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Button, IconButton 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // אייקון לסגירה
import { SongType } from "../../models/songType";

interface EditSongModalProps {
  song: SongType | null;
  folders: { id: number; folderName: string }[];
  onClose: () => void;
  onSave: (updatedSong: SongType) => void;
}

const moodChoices = ["natural","happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"];

const EditSong = ({ song, onClose, onSave }: EditSongModalProps) => {
  const [editedSong, setEditedSong] = useState<SongType>(
    song || { id: 0, songName: "", artist: "", mood_category: "", filePath: "", folderId: -1, userId: 0 }
  );

  if (!song) return null; // אם אין שיר לעריכה, לא להציג כלום

  const handleSave = () => {
    onSave(editedSong);
    onClose();
  };

  return (
    <Dialog open={!!song} onClose={onClose} fullWidth maxWidth="sm">
      {/* כותרת + כפתור סגירה */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Edit Song
        <IconButton onClick={onClose} sx={{ color: "#E91E63" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* תוכן */}
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Song Name"
          value={editedSong.songName}
          onChange={(e) => setEditedSong({ ...editedSong, songName: e.target.value })}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Artist"
          value={editedSong.artist}
          onChange={(e) => setEditedSong({ ...editedSong, artist: e.target.value })}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        
        {/* Select לבחירת קטגוריית מצב רוח */}
        <TextField
          fullWidth
          select
          margin="dense"
          label="Mood Category"
          value={editedSong.mood_category}
          onChange={(e) => setEditedSong({ ...editedSong, mood_category: e.target.value })}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {moodChoices.map((choice) => (
            <MenuItem key={choice} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </TextField>

      </DialogContent>

      {/* כפתורי פעולה */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#E91E63" }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#E91E63", color: "white" }} 
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSong;

