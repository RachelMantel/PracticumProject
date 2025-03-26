import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; 
import { useState } from "react";

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
}

const FolderDialog = ({ open, onClose, onCreateFolder }: FolderDialogProps) => {
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName);
      setFolderName("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add a New Playlist
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Playlist Name"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Button
          onClick={handleCreateFolder}
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#E91E63", color: "white" }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
