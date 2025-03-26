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
    setEditingSong(song);
  };

  const handleSaveEdit = (updatedSong: SongType) => {
    dispatch(updateSong(updatedSong));
    setEditingSong(null);
  };

  const handleDownloadSong = async (song: SongType) => {
    try {
      const response = await fetch(song.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = song.songName || "downloaded_song.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  }

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
              onEdit={() => handleEditSong(song)}
              onDownload={() => handleDownloadSong(song)}              // ✅ חיבור לעריכה
            />
          ))}
        </Stack>
      ) : (
        <Typography>No songs available</Typography>
      )}

      {playingSong && (
        <MusicPlayer song={playingSong} onClose={() => setPlayingSong(null)} />
      )}

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