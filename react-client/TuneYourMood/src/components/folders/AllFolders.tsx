import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { addFolder, fetchUserFolders } from "../redux/FolderSlice";
import { FolderType } from "../../models/folderType";
import { Button, Card, CardContent, Typography, Stack, Dialog, DialogTitle, DialogContent, TextField, CircularProgress, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShowSongs from "../songs/ShowSongs";
import { fetchSongsByFolderId } from "../redux/SongSlice";
import AllSongs from "../songs/AllSongs";
import UploadSong from "../songs/UploadSong";

const AllFolders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const folders = useSelector((state: any) => state.folders?.folders || []);
    const songsByFolder = useSelector((state: any) => state.songs?.songsByFolder || {});
    const loading = useSelector((state: any) => state.songs?.loading || false);    
    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
    const [songs, setSongs] = useState([]); 
    const [isUploadOpen, setUploadOpen] = useState(false);
    
    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

    useEffect(() => {
        dispatch(fetchUserFolders());
    }, [dispatch]);

    useEffect(() => {
        if (selectedFolder) {
            dispatch(fetchSongsByFolderId(selectedFolder?.id??0));
        }
    }, [selectedFolder, dispatch]);

    useEffect(() => {
        if (selectedFolder && songsByFolder[selectedFolder?.id??0]) {
            setSongs(songsByFolder[selectedFolder?.id??0]); 
        }
    }, [selectedFolder, songsByFolder]);

    const handleAddFolder = () => {
        if (!folderName.trim()) return;
        const userId = user?.id;
        if (!userId) {
            alert("User ID is missing!");
            return;
        }

        const newFolder: FolderType = {
            parentId: -1,
            folderName: folderName,
            userId: userId,
        };

        dispatch(addFolder(newFolder));
        setFolderName("");
        setOpen(false);
    };

    const handleShowSongs = (folder: FolderType) => {
        setSelectedFolder(folder);
        setSongs([]);
        dispatch(fetchSongsByFolderId(folder?.id??0));
    };

    return (
        <>
            {/* כפתור הוספת שיר וכפתור יצירת תקייה בראש העמוד */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold" }}>
                    My Songs
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        sx={{ backgroundColor: "#E91E63", color: "white" }}
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        New Folder
                    </Button>
            {/* כפתור הוספת שיר */}
            <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
                <Button
                    sx={{ backgroundColor: "#E91E63", color: "white" }}
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setUploadOpen(true)} // פתיחת הדיאלוג
                >
                    Add Song
                </Button>
            </Stack>

            {/* קומפוננטת העלאת שיר */}
            <UploadSong open={isUploadOpen} onClose={() => setUploadOpen(false)} />

                </Stack>
            </Stack>

            {loading && <Typography variant="h6">Loading folders...</Typography>}

            {folders.length > 0 ? (
                <Stack spacing={2}>
                    {folders
                        .filter((folder: FolderType) => folder.parentId === -1)
                        .map((folder: FolderType) => (
                            <Card key={folder.id} sx={{ m: 2, p: 2, bgcolor: "#212121", color: "white" }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6">{folder.folderName}</Typography>
                                        <Button
                                            sx={{ backgroundColor: "#E91E63", color: "white" }}
                                            variant="contained"
                                            startIcon={<PlayArrowIcon />}
                                            onClick={() => handleShowSongs(folder)}
                                        >
                                            Show Songs
                                        </Button>
                                    </Stack>

                                    {/* טוען בזמן שהשירים נטענים */}
                                    {selectedFolder?.id === folder.id && loading && (
                                        <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
                                    )}

                                    {/* מפריד בין שם התקייה לרשימת השירים */}
                                    {selectedFolder?.id === folder.id && !loading && songs.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 2, bgcolor: "white" }} />
                                            <ShowSongs songs={songs} />
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                </Stack>
            ) : (
                <Typography>No folders available</Typography>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add a New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Folder Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                    <Button onClick={handleAddFolder} variant="contained" sx={{ mt: 2, backgroundColor: "#E91E63", color: "white" }}>
                        Create
                    </Button>
                </DialogContent>
            </Dialog>

            <Stack sx={{ mt: 3 }}>
                <AllSongs />
            </Stack>
        </>
    );
};

export default AllFolders;

