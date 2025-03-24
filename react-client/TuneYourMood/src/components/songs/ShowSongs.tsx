import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";
import SongCard from "./SongCard";
import MusicPlayer from "./MusicPlayer";
import { SongType } from "../../models/songType";
import { AppDispatch } from "../redux/store";
import { deleteSong, updateSong } from "../redux/SongSlice";
import { addSongToFolder } from "../redux/FolderSlice";
import EditSong from "./EditSong";

const ShowSongs = ({ songs }: { songs: Array<SongType> }) => {
  const dispatch = useDispatch<AppDispatch>();
  const folders = useSelector((state: any) => state.folders.folders || []);
  const loading = useSelector((state: any) => state.songs?.loading || false);
  const error = useSelector((state: any) => state.songs?.error || null);

  const [playingSong, setPlayingSong] = useState<SongType | null>(null);
  const [editingSong, setEditingSong] = useState<SongType | null>(null); // ✅ ניהול שיר לעריכה

  const handleMoveSong = (song: SongType, folderId: number) => {
    if (folderId) {
      const updatedSong = { ...song, folderId };
      dispatch(addSongToFolder({ folderId, song: updatedSong }));
    }
    window.location.reload();
  };

  const handleDeleteSong = (songId: number) => {
    dispatch(deleteSong(songId));
  };

  const handlePlaySong = (song: SongType) => {
    setPlayingSong(song);
  };

  const handleEditSong = (song: SongType) => {
    setEditingSong(song); // ✅ פותח את המודל לעריכת השיר
  };

  const handleSaveEdit = (updatedSong: SongType) => {
    dispatch(updateSong(updatedSong)); // ✅ שולח את השינוי ל-Redux
    setEditingSong(null); // ✅ סוגר את המודל
  };

  return (
    <>
      {loading && <Typography variant="h6">Loading songs...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {songs.length > 0 ? (
        <Stack spacing={2}>
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              folders={folders}
              onPlay={handlePlaySong}
              onMoveSong={handleMoveSong}
              onDelete={() => handleDeleteSong(song?.id ?? 0)}
              onEdit={() => handleEditSong(song)} // ✅ חיבור לעריכה
            />
          ))}
        </Stack>
      ) : (
        <Typography>No songs available in this playlist</Typography>
      )}

      {playingSong && (
        <MusicPlayer song={playingSong} onClose={() => setPlayingSong(null)} />
      )}

      {/* ✅ הצגת המודל רק כאשר יש שיר לעריכה */}
      {editingSong && (
        <EditSong
          song={editingSong}
          folders={folders}
          onClose={() => setEditingSong(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ShowSongs;
