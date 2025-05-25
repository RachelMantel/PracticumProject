import { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Stack, Typography, Box, Alert, CircularProgress, LinearProgress } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import SongCard from "./SongCard"
import MusicPlayer from "./MusicPlayer"
import type { SongType } from "../../models/songType"
import type { AppDispatch } from "../redux/store"
import { deleteSong, updateSong } from "../redux/SongSlice"
import { addSongToFolder, deleteSongFromFolder, fetchUserFolders } from "../redux/FolderSlice"
import { useLocation } from "react-router-dom"

interface ShowSongsProps {
  songs: Array<SongType>
  folderId?: number // Add folderId prop to know if we're in a folder view
  onSongRemoved?: (songId: number) => void // Callback for when a song is removed (for folder synchronization)
}

const ShowSongs = ({ songs, folderId, onSongRemoved }: ShowSongsProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const folders = useSelector((state: any) => state.folders.folders || [])
  const foldersLoading = useSelector((state: any) => state.folders?.loading || false)
  const loading = useSelector((state: any) => state.songs?.loading || false)
  const error = useSelector((state: any) => state.songs?.error || null)
  const location = useLocation()

  const [playingSong, setPlayingSong] = useState<SongType | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const isInFolderView = Boolean(folderId) || location.pathname.includes("/my-playlists")

  useEffect(() => {

    if (!folders || folders.length === 0) {
      dispatch(fetchUserFolders())
    } else {
    }
  }, [dispatch, folders, foldersLoading])


  const handleMoveSong = useCallback(
    (song: SongType, targetFolderId: number) => {
      console.log("🎵 Moving song to folder:", { songId: song.id, targetFolderId, availableFolders: folders.length })

      if (targetFolderId) {
        const updatedSong = { ...song, folderId: targetFolderId }
        dispatch(addSongToFolder({ folderId: targetFolderId, song: updatedSong }))
        showSuccessMessage("Song successfully added to playlist")

        setTimeout(() => {
          dispatch(fetchUserFolders())
        }, 500)
      }
    },
    [dispatch, folders],
  )

  const handleDeleteSong = useCallback(
    (songId: number) => {
      if (isInFolderView && folderId) {
        dispatch(deleteSongFromFolder({ folderId, songId }))
        showSuccessMessage("Song removed from playlist")

        if (onSongRemoved) {
          onSongRemoved(songId)
        }
      } else {
        dispatch(deleteSong(songId))
        showSuccessMessage("Song deleted successfully")
      }
    },
    [dispatch, folderId, isInFolderView, onSongRemoved],
  )

  const handlePlaySong = useCallback((song: SongType) => {
    setPlayingSong(null)

    setTimeout(() => {
      setPlayingSong(song)
    }, 50)
  }, [])

  const handleEditSong = useCallback(
    (updatedSong: SongType) => {
      dispatch(updateSong(updatedSong))
      showSuccessMessage("Song updated successfully")
    },
    [dispatch],
  )

  const showSuccessMessage = useCallback((message: string) => {
    setErrorMessage(null)
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }, [])

  const showErrorMessage = useCallback((message: string) => {
    setSuccessMessage(null)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }, [])

  const handleDownloadSong = useCallback(
    async (song: SongType) => {
      if (!song.filePath) {
        showErrorMessage("Song file path is missing")
        return
      }

      setIsDownloading(true)
      setDownloadProgress(0)

      try {
        showSuccessMessage("Downloading song...")

        // Create a new XMLHttpRequest to track progress
        const xhr = new XMLHttpRequest()
        xhr.open("GET", song.filePath, true)
        xhr.responseType = "blob"

        // Track download progress
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setDownloadProgress(progress)
          }
        }

        // Handle completion
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response
            const url = window.URL.createObjectURL(blob)
            const filename = song.songName || "downloaded_song.mp3"

            // Create a temporary link element
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)

            // Trigger the download
            a.click()

            // Clean up
            setTimeout(() => {
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
              setIsDownloading(false)
              showSuccessMessage("Song successfully downloaded")
            }, 100)
          } else {
            throw new Error(`Failed to download: ${xhr.status} ${xhr.statusText}`)
          }
        }

        // Handle errors
        xhr.onerror = () => {
          throw new Error("Network error occurred during download")
        }

        // Start the download
        xhr.send()
      } catch (error) {
        console.error("Error downloading the file:", error)
        setIsDownloading(false)
        showErrorMessage(`Download failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    },
    [showSuccessMessage, showErrorMessage],
  )

  useEffect(() => {
    console.log("📁 Folders state updated:", {
      foldersCount: folders?.length || 0,
      folders: folders,
      loading: foldersLoading,
    })
  }, [folders, foldersLoading])

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {foldersLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            p: 2,
            bgcolor: "rgba(233, 30, 99, 0.1)",
            borderRadius: 2,
          }}
        >
          <CircularProgress size={16} sx={{ color: "#E91E63" }} />
          <Typography variant="body2" color="#E91E63">
            Loading playlists... ({folders?.length || 0} available)
          </Typography>
        </Box>
      )}

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
              {isDownloading && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress variant="determinate" value={downloadProgress} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${downloadProgress}%`}</Typography>
                  </Box>
                </Box>
              )}
            </Alert>
          </motion.div>
        )}

        {errorMessage && (
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
              severity="error"
              sx={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
              }}
            >
              {errorMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress sx={{ color: "#E91E63" }} />
        </Box>
      )}

      {error && (
        <Box sx={{ p: 3, bgcolor: "rgba(244, 67, 54, 0.1)", borderRadius: 2, mb: 3 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      )}

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
        !loading && (
          <Box sx={{ p: 4, textAlign: "center", bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
            <Typography>No songs available</Typography>
          </Box>
        )
      )}

      {/* Render MusicPlayer as a modal when a song is selected */}
      {playingSong && <MusicPlayer song={playingSong} onClose={() => setPlayingSong(null)} />}
    </Box>
  )
}

export default ShowSongs
