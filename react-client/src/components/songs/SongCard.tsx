"use client"

import type React from "react"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material"
import { motion } from "framer-motion"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"
import FolderIcon from "@mui/icons-material/Folder"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import type { SongType } from "../../models/songType"
import type { FolderType } from "../../models/folderType"

interface SongCardProps {
  song: SongType
  folders: FolderType[]
  onPlay: (song: SongType) => void
  onDelete: () => void
  onEdit: (updatedSong: SongType) => void
  onDownload: () => void
  onMoveSong: (song: SongType, folderId: number) => void
  isInFolderView?: boolean
  folderId?: number
}

const SongCard = ({
  song,
  folders,
  onPlay,
  onDelete,
  onEdit,
  onDownload,
  onMoveSong,
  isInFolderView = false,
  folderId,
}: SongCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [editedSong, setEditedSong] = useState<SongType>({ ...song })
  const [selectedFolderId, setSelectedFolderId] = useState<number>(-1)
  const [isHovered, setIsHovered] = useState(false)

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handlePlayClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onPlay(song)
    },
    [onPlay, song],
  )

  const handleEditClick = useCallback(() => {
    setEditDialogOpen(true)
    handleMenuClose()
  }, [handleMenuClose])

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }, [handleMenuClose])

  const handleMoveClick = useCallback(() => {
    setMoveDialogOpen(true)
    handleMenuClose()
  }, [handleMenuClose])

  const handleDownloadClick = useCallback(() => {
    onDownload()
    handleMenuClose()
  }, [onDownload, handleMenuClose])

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedSong((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleMoodChange = useCallback((e: SelectChangeEvent<string>) => {
    setEditedSong((prev) => ({ ...prev, mood_category: e.target.value }))
  }, [])

  const handleFolderChange = useCallback((e: SelectChangeEvent<number>) => {
    setSelectedFolderId(e.target.value as number)
  }, [])

  const handleEditSave = useCallback(() => {
    onEdit(editedSong)
    setEditDialogOpen(false)
  }, [editedSong, onEdit])

  const handleDeleteConfirm = useCallback(() => {
    onDelete()
    setDeleteDialogOpen(false)
  }, [onDelete])

  const handleMoveConfirm = useCallback(() => {
    if (selectedFolderId !== -1) {
      onMoveSong(song, selectedFolderId)
    }
    setMoveDialogOpen(false)
  }, [onMoveSong, selectedFolderId, song])

  const getMoodColor = useCallback((mood: string) => {
    const moodColors: Record<string, string> = {
      happy: "#4CAF50",
      sad: "#2196F3",
      excited: "#FF9800",
      angry: "#F44336",
      relaxed: "#9C27B0",
      natural: "#607D8B",
      hopeful: "#00BCD4",
      grateful: "#8BC34A",
      nervous: "#FF5722",
    }
    return moodColors[mood] || "#757575"
  }, [])

  // Filter out the current folder from the list of available folders
  const availableFolders = folders.filter((folder) => folder.id !== folderId)

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.05)",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(233,30,99,0.1)",
                color: "#E91E63",
                mr: 2,
                flexShrink: 0,
              }}
            >
              <MusicNoteIcon />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  mb: 0.5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {song.songName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {song.artist}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              label={song.mood_category}
              size="small"
              sx={{
                backgroundColor: `${getMoodColor(song.mood_category)}20`,
                color: getMoodColor(song.mood_category),
                fontWeight: 500,
                mr: 1,
                display: { xs: "none", sm: "flex" },
              }}
            />

            <Tooltip title="Play">
              <IconButton
                onClick={handlePlayClick}
                sx={{
                  color: "white",
                  backgroundColor: "#E91E63",
                  "&:hover": { backgroundColor: "#D81B60" },
                  mr: 1,
                  transition: "transform 0.2s",
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
                size="small"
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>

            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, minWidth: 180 },
              }}
            >
              <MenuItem onClick={handleEditClick}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>

              {!isInFolderView && (
                <MenuItem onClick={handleMoveClick}>
                  <ListItemIcon>
                    <FolderIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add to Playlist</ListItemText>
                </MenuItem>
              )}

              <MenuItem onClick={handleDownloadClick}>
                <ListItemIcon>
                  <CloudDownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Download</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleDeleteClick} sx={{ color: "#f44336" }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" sx={{ color: "#f44336" }} />
                </ListItemIcon>
                <ListItemText>{isInFolderView ? "Remove from Playlist" : "Delete"}</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Song Name"
            name="songName"
            value={editedSong.songName}
            onChange={handleEditChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Artist"
            name="artist"
            value={editedSong.artist}
            onChange={handleEditChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Mood</InputLabel>
            <Select value={editedSong.mood_category} label="Mood" onChange={handleMoodChange}>
              <MenuItem value="natural">Natural</MenuItem>
              <MenuItem value="happy">Happy</MenuItem>
              <MenuItem value="sad">Sad</MenuItem>
              <MenuItem value="excited">Excited</MenuItem>
              <MenuItem value="angry">Angry</MenuItem>
              <MenuItem value="relaxed">Relaxed</MenuItem>
              <MenuItem value="hopeful">Hopeful</MenuItem>
              <MenuItem value="grateful">Grateful</MenuItem>
              <MenuItem value="nervous">Nervous</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{isInFolderView ? "Remove from Playlist" : "Delete Song"}</DialogTitle>
        <DialogContent>
          <Typography>
            {isInFolderView
              ? `Are you sure you want to remove "${song.songName}" from this playlist?`
              : `Are you sure you want to delete "${song.songName}"? This action cannot be undone.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            {isInFolderView ? "Remove" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Move to Folder Dialog */}
      <Dialog open={moveDialogOpen} onClose={() => setMoveDialogOpen(false)}>
        <DialogTitle>Add to Playlist</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Playlist</InputLabel>
            <Select value={selectedFolderId} label="Select Playlist" onChange={handleFolderChange}>
              <MenuItem value={-1} disabled>
                Select a playlist
              </MenuItem>
              {availableFolders.map((folder) => (
                <MenuItem key={folder.id} value={folder.id}>
                  {folder.folderName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMoveConfirm} variant="contained" color="primary" disabled={selectedFolderId === -1}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default SongCard
