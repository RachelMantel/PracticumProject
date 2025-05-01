"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Stack, Typography, Box, Alert } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import SongCard from "./SongCard"
import type { SongType } from "../../models/songType"
import type { AppDispatch } from "../redux/store"
import { deleteSong, updateSong } from "../redux/SongSlice"
import { addSongToFolder, deleteSongFromFolder } from "../redux/FolderSlice"
import MusicPlayer from "./MusicPlayer"
import { useLocation } from "react-router-dom"

interface ShowSongsProps {
  songs: Array<SongType>
  folderId?: number // Add folderId prop to know if we're in a folder view
}

const ShowSongs = ({ songs, folderId }: ShowSongsProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const folders = useSelector((state: any) => state.folders.folders || [])
  const loading = useSelector((state: any) => state.songs?.loading || false)
  const error = useSelector((state: any) => state.songs?.error || null)
  const location = useLocation()

  const [playingSong, setPlayingSong] = useState<SongType | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Determine if we're in a folder/playlist view
  const isInFolderView = Boolean(folderId) || location.pathname.includes("/my-playlists")

  const handleMoveSong = (song: SongType, targetFolderId: number) => {
    if (targetFolderId) {
      const updatedSong = { ...song, folderId: targetFolderId }
      dispatch(addSongToFolder({ folderId: targetFolderId, song: updatedSong }))
      showSuccessMessage("Song successfully added to playlist")
    }
  }

  const handleDeleteSong = (songId: number) => {
    if (isInFolderView && folderId) {
      // Remove song from folder/playlist
      dispatch(deleteSongFromFolder({ folderId, songId }))
      showSuccessMessage("Song removed from playlist")
    } else {
      // Delete song completely
      dispatch(deleteSong(songId))
      showSuccessMessage("Song deleted successfully")
    }
  }

  const handlePlaySong = (song: SongType) => {
    setPlayingSong(song)
  }

  const handleEditSong = (updatedSong: SongType) => {
    dispatch(updateSong(updatedSong))
    showSuccessMessage("Song updated successfully")
  }

  const handleDownloadSong = async (song: SongType) => {
    try {
      const response = await fetch(song.filePath)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = song.songName || "downloaded_song.mp3"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      window.URL.revokeObjectURL(url)
      showSuccessMessage("Song successfully downloaded")
    } catch (error) {
      console.error("Error downloading the file:", error)
    }
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "auto",
              maxWidth: "90%",
            }}
          >
            <Alert
              severity="success"
              sx={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
              }}
            >
              {successMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

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
              onEdit={handleEditSong}
              onDownload={() => handleDownloadSong(song)}
              isInFolderView={isInFolderView}
              folderId={folderId}
            />
          ))}
        </Stack>
      ) : (
        !loading && <Typography>No songs available</Typography>
      )}

      {/* Render MusicPlayer as a portal outside the component hierarchy */}
      {playingSong && <MusicPlayer song={playingSong} onClose={() => setPlayingSong(null)} />}
    </Box>
  )
}

export default ShowSongs
