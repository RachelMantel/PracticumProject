import { useState } from "react";
import { Button, Card, CardContent, Stack, Typography, CircularProgress, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import FolderIcon from "@mui/icons-material/Folder"; 
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { FolderType } from "../../models/folderType";
import ShowSongs from "../songs/ShowSongs";
import EditFolderDialog from "./EditFolderDialog";
import DeleteFolderDialog from "./DeleteFolderDialog";

type FolderCardProps = {
    folder: FolderType;
    songs: any[]; // שירים שהורדו
    loading: boolean; // האם אנחנו בטעינה
    onShowSongs: (folder: FolderType) => void;
    onCloseSongs: () => void; // פונקציה להוריד את השירים עבור תיקיה
};

const FolderCard = ({ folder, songs, loading, onShowSongs }: FolderCardProps) => {
    const [editFolderOpen, setEditFolderOpen] = useState(false);
    const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);

    const handleShowSongs = () => {
        console.log(folder);
        onShowSongs(folder);
    };

    const handleEditFolder = () => {
        setEditFolderOpen(true);
    };

    const handleDeleteFolder = () => {
        setDeleteFolderOpen(true);
    };

    return (
        <Card sx={{ m: 2, p: 2, bgcolor: "#212121", color: "white", position: "relative" }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {/* הוספת האייקון ליד שם התיקיה */}
                    <Stack direction="row" alignItems="center">
                        <QueueMusicIcon  sx={{ mr: 1 }} /> {/* אייקון תיקיה */}
                        <Typography variant="h6">{folder.folderName}</Typography>
                    </Stack>

                    <Stack direction="row">
                        <Button
                            sx={{ backgroundColor: "#212121", color: "white" }}
                            startIcon={<EditIcon />}
                            onClick={handleEditFolder}
                        ></Button>
                        <Button
                            sx={{ backgroundColor: "#212121", color: "white" }}
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteFolder}
                        ></Button>
                        <Button
                            sx={{ backgroundColor: "#E91E63", color: "white" }}
                            variant="contained"
                            onClick={handleShowSongs}
                        >
                            Show Songs
                        </Button>
                    </Stack>
                </Stack>

                {songs && songs.length > 0 && !loading && (
                    <>
                        <Divider sx={{ my: 2, bgcolor: "white" }} />
                        <ShowSongs songs={songs} />
                    </>
                )}
                {loading && songs.length == 0 && (
                    <>
                         
                        <Typography sx={{ mx: "auto", my: 2 }} variant="h6">empty folder!</Typography>
                    </>
                )}

                {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}

            </CardContent>

            {/* דיאלוגים */}
            <EditFolderDialog open={editFolderOpen} folder={folder} onClose={() => { setEditFolderOpen(false); window.location.reload(); }} />
            <DeleteFolderDialog open={deleteFolderOpen} folder={folder} onClose={() => { setDeleteFolderOpen(false); window.location.reload(); }} />
        </Card>
    );
};

export default FolderCard;
