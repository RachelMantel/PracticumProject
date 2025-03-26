import { Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface FolderActionsProps {
  onNewFolderClick: () => void;
}

const FolderActions = ({ onNewFolderClick }: FolderActionsProps) => (
  <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
    <Button
      sx={{ backgroundColor: "#E91E63", color: "white", marginRight: 2 }} // ניתן להוסיף רווח בין הכפתורים
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onNewFolderClick}
    >
      New Playlist
    </Button>
  </Stack>
);

export default FolderActions;

