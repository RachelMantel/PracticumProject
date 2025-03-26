import { Dialog, DialogTitle, DialogContent, Button, Typography } from "@mui/material";
import { FolderType } from "../../models/folderType";
import { useDispatch } from "react-redux";
import { deleteFolder } from "../redux/FolderSlice"; // ייבוא הפעולה למחיקת תקיה

type DeleteFolderDialogProps = {
  open: boolean;
  folder: FolderType;
  onClose: () => void;
};

const DeleteFolderDialog = ({ open, folder, onClose }: DeleteFolderDialogProps) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {

      await dispatch(deleteFolder(folder?.id??0) as any);
      onClose(); // סגור את הדיאלוג לאחר המחיקה
      window.location.reload();
    } catch (error) {
      console.error("Error deleting folder: ", error);
      // תוכל להוסיף הודעה למשתמש במקרה של שגיאה
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this folder?</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#D32F2F", color: "white" }}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button variant="outlined" sx={{ mt: 2, marginLeft: 1 }} onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFolderDialog;
