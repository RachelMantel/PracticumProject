"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import { updateFolder, fetchUserFolders } from "../redux/FolderSlice"
import type { FolderType } from "../../models/folderType"
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
import { Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material"

interface EditFolderDialogProps {
  open: boolean
  folder: FolderType
  onClose: () => void
}

const EditFolderDialog = ({ open, folder, onClose }: EditFolderDialogProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [folderName, setFolderName] = useState(folder?.folderName || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setFolderName(folder?.folderName || "")
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, folder])

  const handleUpdateFolder = async () => {
    if (folderName.trim() && folder?.id) {
      setIsSubmitting(true)
      await dispatch(
          updateFolder(
            { id: folder.id, folderName: folderName, userId: folder.userId, parentId: folder.parentId ,songs: folder.songs}
         ),
      )
      await dispatch(fetchUserFolders())
      setIsSubmitting(false)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && folderName.trim()) {
      handleUpdateFolder()
    }
  }

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
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EditIcon sx={{ color: "#E91E63", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edit Playlist
          </Typography>
        </Box>
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

      <DialogContent>
        <Box sx={{ py: 2 }}>
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
          onClick={handleUpdateFolder}
          disabled={!folderName.trim() || isSubmitting || folderName === folder?.folderName}
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
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditFolderDialog
