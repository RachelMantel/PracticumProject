import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchUserFolders, addFolder } from "../redux/FolderSlice";
import { FolderType } from "../../models/folderType";
import { Button, Stack, Typography, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderCard from "./FolderCard";
import FolderDialog from "./FolderDialog";

const AllFolders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const folders = useSelector((state: any) => state.folders?.folders || []);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUserFolders());
  }, [dispatch]);

  const handleAddFolder = (folderName: string) => {
    const userId = JSON.parse(localStorage.getItem("user") || "null")?.id;
    const newFolder: FolderType = {
      parentId: -1,
      folderName: folderName,
      userId: userId,
      songs: []
    };
    dispatch(addFolder(newFolder));
    console.log(newFolder);
    setOpenFolderDialog(false);
    window.location.reload();
  };

  const filteredFolders = folders.filter((folder: FolderType) => 
    folder.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold" }}>
          My Playlist
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            sx={{ backgroundColor: "#E91E63", color: "white" }}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenFolderDialog(true)}
          >
            Add Playlist
          </Button>
        </Stack>
      </Stack>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search playlists..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FolderDialog
        open={openFolderDialog}
        onClose={() => setOpenFolderDialog(false)}
        onCreateFolder={handleAddFolder}
      />

      {filteredFolders.length > 0 ? (
        <Stack spacing={2}>
          {filteredFolders.map((folder: FolderType) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </Stack>
      ) : (
        <Typography>No playlist available</Typography>
      )}
    </>
  );
};

export default AllFolders;
