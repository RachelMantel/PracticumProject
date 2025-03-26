import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, Stack, Typography, CircularProgress, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FolderType } from "../../models/folderType";
import ShowSongs from "../songs/ShowSongs";
import EditFolderDialog from "./EditFolderDialog";
import DeleteFolderDialog from "./DeleteFolderDialog";
import { fetchSongsByFolder } from "../redux/FolderSlice";
import { AppDispatch } from "../redux/store";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { LibraryMusic } from "@mui/icons-material";

type FolderCardProps = {
    folder: FolderType;
};

const FolderCard = ({ folder }: FolderCardProps) => {
    const dispatch1 = useDispatch<AppDispatch>();
    const songs = useSelector((state: any) => state.folders.songsByFolder[folder?.id ?? 0] || []);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editFolderOpen, setEditFolderOpen] = useState(false);
    const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const handleToggleSongs = async () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            if (songs.length === 0) {
                setLoading(true);
                dispatch1(fetchSongsByFolder(folder?.id ?? 0));
                setLoading(false);
            }
            setIsOpen(true);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ m: 2, p: 2, bgcolor: "#212121", color: "white", position: "relative" }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center">
                        <LibraryMusic sx={{ mr: 1 }} />
                        <Typography variant="h6">{folder.folderName}</Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <IconButton onClick={handleToggleSongs} sx={{ color: "#E91E63" }}>
                            {isOpen ? <ArrowDropUpIcon sx={{ fontSize: "2rem" }} /> : <ArrowDropDownIcon sx={{ fontSize: "2rem" }} />}
                        </IconButton>
                        <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={() => setEditFolderOpen(true)}>
                                <EditIcon sx={{ mr: 1 }} /> Edit
                            </MenuItem>
                            <MenuItem onClick={() => setDeleteFolderOpen(true)}>
                                <DeleteIcon sx={{ mr: 1 }} /> Delete
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Stack>

                {isOpen && (
                    <>
                        <Divider sx={{ my: 2, bgcolor: "white" }} />
                        {loading ? (
                            <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
                        ) : songs.length > 0 ? (
                            <ShowSongs songs={songs} />
                        ) : (
                            <Typography sx={{ mx: "auto", my: 2 }} variant="h6">Empty playlist!</Typography>
                        )}
                    </>
                )}
            </CardContent>

            <EditFolderDialog open={editFolderOpen} folder={folder} onClose={() => { setEditFolderOpen(false); window.location.reload(); }} />
            <DeleteFolderDialog open={deleteFolderOpen} folder={folder} onClose={() => { setDeleteFolderOpen(false); window.location.reload(); }} />
        </Card>
    );
};

export default FolderCard;
