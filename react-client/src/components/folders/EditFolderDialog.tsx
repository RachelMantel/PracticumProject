import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { FolderType } from "../../models/folderType";
import { useDispatch } from "react-redux";
import { updateFolder } from "../redux/FolderSlice"; // ייבוא הפעולה שנוצרה
import CloseIcon from "@mui/icons-material/Close"; // אייקון סגירה

type EditFolderDialogProps = {
  open: boolean;
  folder: FolderType;
  onClose: () => void;
};

const EditFolderDialog = ({ open, folder, onClose }: EditFolderDialogProps) => {
  const [folderName, setFolderName] = useState(folder.folderName); // שים לב לשם התקיה שיתעדכן
  const dispatch = useDispatch();

  const handleSave = () => {
    // עדכון שם התקיה ב-Redux, השתמש ב-folderName החדש שנשמר ב-state
    let help: FolderType = { id: folder.id, folderName: folderName, userId: folder.userId, parentId: folder.parentId ,songs: folder.songs};
    dispatch(updateFolder(help) as any);
    onClose(); // סגור את הדיאלוג לאחר השמירה
  };

  const handleCancel = () => {
    onClose(); // סגור את הדיאלוג מבלי לשמור שינויים
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit Folder Name
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCancel} // פעולת ביטול
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Folder Name"
          fullWidth
          value={folderName} // השתמש ב-value של folderName החדש
          onChange={(e) => setFolderName(e.target.value)} // עדכון שם התקיה ב-state
          variant="outlined"
        />
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#E91E63", color: "white" }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2, ml: 2 }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderDialog;
