import { useState } from "react";
import { Card, CardContent, Stack, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { SongType } from "../../models/songType";
import { FolderType } from "../../models/folderType";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LibraryMusic } from "@mui/icons-material";

interface SongCardProps {
    song: SongType;
    folders: FolderType[];
    onPlay: (song: SongType) => void;
    onMoveSong: (song: SongType, folderId: number) => void;
    onDelete: () => void;
    onEdit: () => void;
    onDownload: () => void;
}

const SongCard = ({ song, folders, onPlay, onMoveSong, onDelete, onEdit, onDownload }: SongCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [subMenuOpen, setSubMenuOpen] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSubMenuOpen(null);
    };

    const handleMoveOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSubMenuOpen(event.currentTarget);
    };

    return (
        <Card sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "white", color: "black" }}>
            <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h6">🎵</Typography>
                    <Typography variant="h6" sx={{ ml: 1 }}>{song.songName}</Typography>
                </Stack>
                <Typography variant="body2" color="gray">
                    {song.artist}
                </Typography>
            </CardContent>

            {/* כפתור PLAY */}
            <IconButton 
                sx={{ color: "white", bgcolor: "#E91E63",margin:"10px", transition: "0.3s", "&:hover": { bgcolor: "#d81b60" } }} 
                onClick={() => onPlay(song)}
            >
                <PlayArrowIcon sx={{ fontSize: "1.8rem" }} />
            </IconButton>

            {/* כפתור תפריט שלוש נקודות */}
            <IconButton 
                sx={{ color: "black", transition: "0.3s", "&:hover": { bgcolor: "#f5f5f5" } }} 
                onClick={handleMenuOpen}
            >
                <MoreVertIcon />
            </IconButton>

            {/* תפריט ראשי */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleMenuClose(); onDownload(); }}>
                    <DownloadIcon sx={{ mr: 1 }} /> Download
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); onEdit(); }}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); onDelete(); }}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>

                {/* תפריט העברה לתיקייה */}
                <MenuItem onClick={handleMoveOpen}>
                    <AddCircleIcon sx={{ mr: 1 }} /> Move to playlist
                </MenuItem>
                
                {subMenuOpen && (
                    <Menu
                        anchorEl={subMenuOpen}
                        open={Boolean(subMenuOpen)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                        {folders.length > 0 ? (
                            folders.map((folder: FolderType) => (
                                <MenuItem key={folder.id} onClick={() => { onMoveSong(song, folder?.id??0); handleMenuClose(); }}>
                                    <LibraryMusic/>  {folder.folderName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No folders available</MenuItem>
                        )}
                    </Menu>
                )}
            </Menu>
        </Card>
    );
};

export default SongCard;