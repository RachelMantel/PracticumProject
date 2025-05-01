"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Chip,
  Tooltip,
  Fade,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import DownloadIcon from "@mui/icons-material/Download"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import AlbumIcon from "@mui/icons-material/Album"
import CategoryIcon from "@mui/icons-material/Category"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import type { SongType } from "../../models/songType"
import type { FolderType } from "../../models/folderType"

interface SongCardProps {
  song: SongType
  folders: FolderType[]
  onPlay: (song: SongType) => void
  onMoveSong: (song: SongType, folderId: number) => void
  onDelete: () => void
  onEdit: (updatedSong: SongType) => void
  onDownload: () => void
  isInFolderView?: boolean
  folderId?: number
}

const SongCard = ({
  song,
  folders,
  onPlay,
  onMoveSong,
  onDelete,
  onEdit,
  onDownload,
  isInFolderView = false,
  folderId,
}: SongCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [subMenuOpen, setSubMenuOpen] = useState<null | HTMLElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSong, setEditedSong] = useState<SongType>({ ...song })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Mood choices
  const moodChoices = ["happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]

  // Generate a color based on the song name
  const generateColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Generate colors in the pink/orange range to match the E91E63/FF5722 gradient
    const h = ((hash % 30) + 340) % 360 // Hue between 340-370 (pinks/reds/oranges)
    return `hsl(${h}, 80%, 65%)`
  }

  const songColor = generateColor(song.songName)

  useEffect(() => {
    setEditedSong({ ...song })
  }, [song])

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSubMenuOpen(null)
  }

  const handleMoveOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSubMenuOpen(event.currentTarget)
  }

  const handleEditClick = () => {
    setIsEditing(true)
    handleMenuClose()
  }

  const handleSaveEdit = () => {
    onEdit(editedSong)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedSong({ ...song })
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof SongType, value: string) => {
    setEditedSong((prev) => ({ ...prev, [field]: value }))
  }

  const handleMoodChange = (event: SelectChangeEvent) => {
    handleInputChange("mood_category", event.target.value)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(!isPlaying)
    onPlay(song)
  }

  return (
    <Card
      component={motion.div}
      whileHover={{
        translateY: -4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        transition: { duration: 0.3 },
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderRadius: "16px",
        background: isEditing
          ? "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))"
          : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        border: isEditing ? "2px solid #E91E63" : "1px solid rgba(233,30,99,0.1)",
        boxShadow: isEditing ? "0 4px 20px rgba(233,30,99,0.15)" : "0 4px 16px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.03,
          background: `linear-gradient(135deg, ${songColor}, #E91E63)`,
          zIndex: 0,
        }}
      />

      {/* Left side - Play button */}
      <Box
        sx={{
          display: "flex",
          mr: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            position: "relative",
            width: 50,
            height: 50,
            borderRadius: "12px",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${songColor}, #E91E63)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <IconButton
            onClick={handlePlayClick}
            sx={{
              color: "white",
              p: 0,
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              "&:hover": { background: "rgba(0,0,0,0.1)" },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Middle - Song info */}
      <CardContent
        sx={{
          flex: 1,
          py: 1,
          position: "relative",
          zIndex: 1,
          "&:last-child": { pb: 1 },
        }}
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Song Name"
                  value={editedSong.songName}
                  onChange={(e) => handleInputChange("songName", e.target.value)}
                  InputProps={{
                    startAdornment: <MusicNoteIcon sx={{ mr: 1, color: "#E91E63" }} />,
                    sx: {
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(233,30,99,0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(233,30,99,0.5)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E91E63",
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "rgba(0,0,0,0.6)",
                      "&.Mui-focused": {
                        color: "#E91E63",
                      },
                    },
                  }}
                />
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Artist"
                    value={editedSong.artist}
                    onChange={(e) => handleInputChange("artist", e.target.value)}
                    InputProps={{
                      startAdornment: <AlbumIcon sx={{ mr: 1, color: "#E91E63" }} />,
                      sx: {
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(233,30,99,0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(233,30,99,0.5)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E91E63",
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "rgba(0,0,0,0.6)",
                        "&.Mui-focused": {
                          color: "#E91E63",
                        },
                      },
                    }}
                  />
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(233,30,99,0.3)",
                        borderRadius: "10px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(233,30,99,0.5)",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E91E63",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#E91E63",
                      },
                    }}
                  >
                    <InputLabel id="mood-select-label" sx={{ display: "flex", alignItems: "center" }}>
                      <CategoryIcon sx={{ mr: 1, color: "#E91E63", fontSize: "1.2rem" }} /> Mood
                    </InputLabel>
                    <Select
                      labelId="mood-select-label"
                      value={editedSong.mood_category || ""}
                      onChange={handleMoodChange}
                      label="Mood"
                      sx={{
                        borderRadius: "10px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          pl: 1,
                        },
                      }}
                    >
                      {moodChoices.map((mood) => (
                        <MenuItem key={mood} value={mood}>
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "1.1rem",
                  mb: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {song.songName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {song.artist}
                </Typography>
                {song.mood_category && (
                  <Chip
                    label={song.mood_category}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      background: `linear-gradient(135deg, ${songColor}40, rgba(233,30,99,0.2))`,
                      color: "#E91E63",
                      border: "1px solid rgba(233,30,99,0.1)",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                )}
              </Box>

              {/* Audio visualization (decorative) */}
              {isPlaying && (
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    alignItems: "flex-end",
                    height: 20,
                    gap: 0.5,
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [
                          `${4 + Math.random() * 16}px`,
                          `${4 + Math.random() * 16}px`,
                          `${4 + Math.random() * 16}px`,
                        ],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: i * 0.05,
                      }}
                      style={{
                        width: 3,
                        borderRadius: 2,
                        background: `linear-gradient(to top, ${songColor}, #E91E63)`,
                      }}
                    />
                  ))}
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Right side - Actions */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {isEditing ? (
          <>
            <Tooltip title="Save" arrow>
              <IconButton
                onClick={handleSaveEdit}
                sx={{
                  color: "white",
                  bgcolor: "#4CAF50",
                  "&:hover": {
                    bgcolor: "#388E3C",
                    transform: "scale(1.1)",
                  },
                  width: 40,
                  height: 40,
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(76,175,80,0.3)",
                }}
              >
                <CheckIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel" arrow>
              <IconButton
                onClick={handleCancelEdit}
                sx={{
                  color: "white",
                  bgcolor: "#9e9e9e",
                  "&:hover": {
                    bgcolor: "#757575",
                    transform: "scale(1.1)",
                  },
                  width: 40,
                  height: 40,
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Options" arrow>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "rgba(0,0,0,0.6)",
                "&:hover": {
                  bgcolor: "rgba(233,30,99,0.1)",
                  color: "#E91E63",
                },
                transition: "all 0.2s ease",
              }}
            >
              <MoreVertIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: "12px",
            minWidth: 180,
            overflow: "hidden",
            mt: 1,
            "& .MuiMenuItem-root": {
              py: 1.2,
              px: 2,
              "&:hover": {
                bgcolor: "rgba(233,30,99,0.08)",
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onDownload()
            handleMenuClose()
          }}
        >
          <DownloadIcon fontSize="small" sx={{ mr: 1.5, color: "#E91E63" }} /> Download
        </MenuItem>

        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: "#E91E63" }} /> Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete()
            handleMenuClose()
          }}
          sx={{ color: isInFolderView ? "#FF9800" : "#e53935" }}
        >
          {isInFolderView ? (
            <>
              <RemoveCircleOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Remove from Playlist
            </>
          ) : (
            <>
              <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
            </>
          )}
        </MenuItem>

        {!isInFolderView && (
          <MenuItem onClick={handleMoveOpen}>
            <AddCircleIcon fontSize="small" sx={{ mr: 1.5, color: "#E91E63" }} /> Add to Playlist
          </MenuItem>
        )}

        <Menu
          anchorEl={subMenuOpen}
          open={Boolean(subMenuOpen)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: "12px",
              minWidth: 180,
              overflow: "hidden",
              ml: 1,
              "& .MuiMenuItem-root": {
                py: 1.2,
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(233,30,99,0.08)",
                },
              },
            },
          }}
        >
          {folders.length > 0 ? (
            folders.map((folder) => (
              <MenuItem
                key={folder.id}
                onClick={() => {
                  onMoveSong(song, folder?.id ?? 0)
                  handleMenuClose()
                }}
              >
                <LibraryMusicIcon fontSize="small" sx={{ mr: 1.5, color: "#E91E63" }} /> {folder.folderName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No available folders</MenuItem>
          )}
        </Menu>
      </Menu>
    </Card>
  )
}

export default SongCard
