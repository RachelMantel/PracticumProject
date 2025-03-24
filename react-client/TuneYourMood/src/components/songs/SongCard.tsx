import { Card, CardContent, Stack, Typography, Button, Select, MenuItem } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { SongType } from "../../models/songType";
import { FolderType } from "../../models/folderType";
import SongActions from "./SongActions";
import DownloadButton from "./DownloadButton";

interface SongCardProps {
    song: SongType;
    folders: FolderType[];
    onPlay: (song: SongType) => void;
    onMoveSong: (song: SongType, folderId: number) => void;
    onDelete: () => void;
    onEdit: () => void;
}

const SongCard = ({ song, folders, onPlay, onMoveSong, onDelete, onEdit }: SongCardProps) => {
    return (
        <Card sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "white", color: "black" }}>
            <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center">
                    <Typography variant="h6">🎵</Typography>
                    <Typography variant="h6">{song.songName}</Typography>
                </Stack>
                <Typography variant="body2" color="gray">
                    {song.artist}
                </Typography>
            </CardContent>

            {/* כפתור PLAY */}
            <Button
                sx={{ backgroundColor: "#E91E63", color: "white", fontWeight: "bold" }}
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => onPlay(song)}
            >
                Play
            </Button>

            {/* כפתור להורדת השיר */}
            <DownloadButton 
                songUrl={song.filePath} 
                fileName={`${song.songName}.mp3`} 
            />

            {/* כפתורי עריכה ומחיקה */}
            <SongActions onDelete={onDelete} onEdit={onEdit} />

            <Select
                value={song.folderId || ""}
                onChange={(e) => onMoveSong(song, Number(e.target.value))}
                displayEmpty
                sx={{ ml: 2, minWidth: 120 }}
                renderValue={() => "Move to playlist"}
            >
                <MenuItem value="" disabled>Move to playlist</MenuItem>
                {folders.map((folder: FolderType) => (
                    <MenuItem key={folder.id} value={folder.id}>
                        {folder.folderName}
                    </MenuItem>
                ))}
            </Select>

        </Card>
    );
};

export default SongCard;
