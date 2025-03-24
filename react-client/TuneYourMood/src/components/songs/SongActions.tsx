import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface SongActionsProps {
  onDelete: () => void;
  onEdit: () => void;
}

const SongActions = ({ onDelete, onEdit }: SongActionsProps) => {
  return (
    <div>
      <IconButton onClick={onEdit} sx={{ color: "black" }}>
        <EditIcon    sx={{ color: "#E91E63" }} />
      </IconButton>
      <IconButton onClick={onDelete} sx={{ color: "black" }}>
        <DeleteIcon     sx={{ color: "#E91E63" }}/>
      </IconButton >
    </div>
  );
};

export default SongActions;
