"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../redux/store"
import { deleteFolder, fetchUserFolders } from "../redux/FolderSlice"
import type { FolderType } from "../../models/folderType"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material"
import { Delete as DeleteIcon, Warning as WarningIcon } from "@mui/icons-material"

interface DeleteFolderDialogProps {
  open: boolean
  folder: FolderType
  onClose: () => void
}

const DeleteFolderDialog = ({ open, folder, onClose }: DeleteFolderDialogProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteFolder = async () => {
    if (folder?.id) {
      setIsDeleting(true)
      await dispatch(deleteFolder(folder.id))
      await dispatch(fetchUserFolders())
      setIsDeleting(false)
      onClose()
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
          <WarningIcon sx={{ color: "#f44336", mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Delete Playlist
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to delete <strong>{folder?.folderName}</strong>?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          This action cannot be undone and all songs in this playlist will be removed.
        </Typography>
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
          onClick={handleDeleteFolder}
          disabled={isDeleting}
          sx={{
            bgcolor: "#f44336",
            color: "white",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#d32f2f" },
            borderRadius: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Deleting...
            </>
          ) : (
            <>
              <DeleteIcon fontSize="small" />
              Delete Playlist
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteFolderDialog
