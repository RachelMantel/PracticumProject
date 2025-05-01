import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material"
import {
  Close as CloseIcon,
  MusicNote,
  Album,
  Headphones,
  QueueMusic,
  Radio,
  Mic,
  LibraryMusic,
} from "@mui/icons-material"

interface FolderDialogProps {
  open: boolean
  onClose: () => void
  onCreateFolder: (folderName: string) => void
}

const FolderDialog = ({ open, onClose, onCreateFolder }: FolderDialogProps) => {
  const [folderName, setFolderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleCreateFolder = async () => {
    if (folderName.trim()) {
      setIsSubmitting(true)
      await onCreateFolder(folderName)
      setFolderName("")
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && folderName.trim()) {
      handleCreateFolder()
    }
  }

  // Icons for the animation
  const icons = [MusicNote, Album, Headphones, QueueMusic, Radio, Mic, LibraryMusic]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #E91E63, #FF5722)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Create New Playlist
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ position: "relative" }}>
        {/* Animated music icons */}
        <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <AnimatePresence>
            {open &&
              icons.map((Icon, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    scale: 0.5,
                    rotate: Math.random() * 360,
                  }}
                  animate={{
                    opacity: [0, 0.7, 0],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    scale: [0.5, 1.2, 0.8],
                    rotate: Math.random() * 720 - 360,
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: index * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  style={{
                    position: "absolute",
                    color: "rgba(233, 30, 99, 0.1)",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Icon sx={{ fontSize: 24 + Math.random() * 24 }} />
                </motion.div>
              ))}
          </AnimatePresence>
        </Box>

        <Box sx={{ py: 2, position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ position: "relative" }}
            >
              <Box
                sx={{
                  background: "linear-gradient(90deg, #E91E63, #FF5722)",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow: "0 4px 20px rgba(233, 30, 99, 0.3)",
                }}
              >
                <LibraryMusic sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px solid #E91E63",
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </Box>

          <TextField
            inputRef={inputRef}
            label="Playlist Name"
            placeholder="My Awesome Playlist"
            variant="outlined"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#E91E63",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#E91E63",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#E91E63",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
            borderRadius: 2,
            px: 2,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateFolder}
          disabled={!folderName.trim() || isSubmitting}
          sx={{
            background: "linear-gradient(90deg, #E91E63, #FF5722)",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(90deg, #D81B60, #F4511E)",
            },
            borderRadius: 2,
            px: 3,
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            "Create Playlist"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FolderDialog
