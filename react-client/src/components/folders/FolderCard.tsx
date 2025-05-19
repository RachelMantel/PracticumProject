import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { AppDispatch } from "../redux/store"
import { fetchSongsByFolder } from "../redux/FolderSlice"
import type { FolderType } from "../../models/folderType"
import {Card,CardContent,Typography,Box,IconButton,Menu,
  MenuItem,Divider,Button,CircularProgress,Tooltip,} from "@mui/material"
import {MoreVert as MoreVertIcon,Edit as EditIcon,Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,LibraryMusic,
  MusicNote,Refresh as RefreshIcon,} from "@mui/icons-material"
import ShowSongs from "../songs/ShowSongs"
import EditFolderDialog from "./EditFolderDialog"
import DeleteFolderDialog from "./DeleteFolderDialog"

type FolderCardProps = {
  folder: FolderType
  onPlayFolder?: (folderId: number) => void
}

const FolderCard = ({ folder }: FolderCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const songs = useSelector((state: any) => state.folders.songsByFolder[folder?.id ?? 0] || [])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editFolderOpen, setEditFolderOpen] = useState(false)
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [songCount, setSongCount] = useState(folder.songs?.length || 0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [localSongs, setLocalSongs] = useState(songs)

  const refreshSongs = useCallback(async () => {
    if (folder?.id) {
      setLoading(true)
      await dispatch(fetchSongsByFolder(folder.id))
      setLoading(false)
      setRefreshKey((prev) => prev + 1) 
    }
  }, [dispatch, folder?.id])

  useEffect(() => {
    const fetchSongsCount = async () => {
      if ((songs.length === 0 || isOpen) && folder?.id) {
        setLoading(true)
        await dispatch(fetchSongsByFolder(folder.id))
        setLoading(false)
      }
    }

    fetchSongsCount()
  }, [dispatch, folder.id, songs.length, isOpen])

  // Update song count whenever songs change
  useEffect(() => {
    if (songs) {
      setSongCount(songs.length)
      setLocalSongs(songs)
    } else if (folder.songs?.length) {
      setSongCount(folder.songs.length)
      setLocalSongs(folder.songs)
    } else {
      setSongCount(0)
      setLocalSongs([])
    }
  }, [songs, folder.songs, refreshKey]) // Add refreshKey to dependencies

  const handleToggleSongs = async () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      if (songs.length === 0 && folder?.id) {
        setLoading(true)
        await dispatch(fetchSongsByFolder(folder.id))
        setLoading(false)
      }
      setIsOpen(true)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleManualRefresh = (e: React.MouseEvent) => {
    e.stopPropagation()
    refreshSongs()
  }

  // Handle song removal with immediate UI update
  const handleSongRemoved = useCallback(
    (songId: number) => {
      // Update local state immediately for responsive UI
      setLocalSongs((prevSongs: any[]) => prevSongs.filter((song) => song.id !== songId))
      setSongCount((prev) => Math.max(0, prev - 1))

      // Then refresh from server
      refreshSongs()
    },
    [refreshSongs],
  )

  const generatePastelColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const h = ((hash % 30) + 340) % 360 // Hue between 340-370 (pinks/reds/oranges)
    const s = 70 + (hash % 20) // Saturation 70-90%
    const l = 75 + (hash % 15) // Lightness 75-90%
    return `hsl(${h}, ${s}%, ${l}%)`
  }

  const bgColor = generatePastelColor(folder.folderName)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      key={`folder-${folder.id}-${refreshKey}`} // Add refreshKey to force re-render
    >
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box
          sx={{
            height: 140,
            position: "relative",
            background: `linear-gradient(135deg, ${bgColor} 0%, #E91E63 100%)`,
          }}
        >

          {isHovered && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    color: "rgba(255, 255, 255, 0.3)",
                  }}
                  initial={{
                    top: "70%",
                    left: `${15 + i * 10}%`,
                    opacity: 0,
                    scale: 0.5,
                    rotate: Math.random() * 20 - 10,
                  }}
                  animate={{
                    top: "10%",
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.8],
                    rotate: Math.random() * 40 - 20,
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: i * 0.5,
                  }}
                >
                  <MusicNote sx={{ fontSize: 16 }} />
                </motion.div>
              ))}
            </>
          )}

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(4px)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={12} sx={{ color: "white" }} />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    {songCount} {songCount === 1 ? "track" : "tracks"}
                  </>
                )}
              </Box>

              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: "white", p: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { borderRadius: 2, minWidth: 120 },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem
                  onClick={() => {
                    setEditFolderOpen(true)
                    handleMenuClose()
                  }}
                >
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDeleteFolderOpen(true)
                    handleMenuClose()
                  }}
                  sx={{ color: "#f44336" }}
                >
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              {folder.folderName}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LibraryMusic sx={{ fontSize: 20, color: "#E91E63", mr: 1 }} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {songCount === 0 ? "Empty playlist" : `${songCount} ${songCount === 1 ? "song" : "songs"}`}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Add refresh button with tooltip */}
              <Tooltip title="Refresh playlist">
                <IconButton
                  size="small"
                  onClick={handleManualRefresh}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Button
                size="small"
                onClick={handleToggleSongs}
                endIcon={isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                sx={{
                  color: "text.secondary",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                  minWidth: 0,
                  px: 1,
                }}
              >
                {isOpen ? "Hide" : "View"}
              </Button>
            </Box>
          </Box>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              key={`folder-content-${refreshKey}`} // Add refreshKey to force re-render
            >
              <Divider sx={{ my: 2 }} />

              {loading ? (
                <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={32} sx={{ color: "#E91E63" }} />
                </Box>
              ) : localSongs.length > 0 ? (
                <ShowSongs songs={localSongs} folderId={folder.id} onSongRemoved={handleSongRemoved} />
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <MusicNote sx={{ fontSize: 48, color: "rgba(0, 0, 0, 0.2)", mb: 1 }} />
                  <Typography sx={{ color: "text.secondary" }}>This playlist is empty</Typography>
                  <Button
                    sx={{
                      color: "#E91E63",
                      mt: 1,
                      display: "flex",
                      margin: "0 auto",
                      marginTop: 1,
                    }}
                  >
                    Add songs
                  </Button>
                </Box>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <EditFolderDialog open={editFolderOpen} folder={folder} onClose={() => setEditFolderOpen(false)} />
      <DeleteFolderDialog open={deleteFolderOpen} folder={folder} onClose={() => setDeleteFolderOpen(false)} />
    </motion.div>
  )
}

export default FolderCard
