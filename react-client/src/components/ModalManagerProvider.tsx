"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import { Box, IconButton, Typography, Paper } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import OpenInFullIcon from "@mui/icons-material/OpenInFull"
import CloseIcon from "@mui/icons-material/Close"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

// Define types for our modals
type ModalType = "musicPlayer" | "songUploader"

interface MinimizedModal {
  id: string
  type: ModalType
  title: string
  data: any
}

interface ModalContextType {
  minimizeModal: (id: string, type: ModalType, title: string, data: any) => void
  restoreModal: (id: string) => void
  closeModal: (id: string) => void
  getMinimizedModals: () => MinimizedModal[]
  isModalMinimized: (id: string) => boolean
}

// Create context
const ModalContext = createContext<ModalContextType | null>(null)

// Hook to use the modal context
export const useModalManager = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModalManager must be used within a ModalManagerProvider")
  }
  return context
}

// Provider component
export const ModalManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [minimizedModals, setMinimizedModals] = useState<MinimizedModal[]>([])
  const [activeModals, setActiveModals] = useState<string[]>([])

  // Function to minimize a modal
  const minimizeModal = (id: string, type: ModalType, title: string, data: any) => {
    // Check if modal is already minimized
    const existingModalIndex = minimizedModals.findIndex((modal) => modal.id === id)

    if (existingModalIndex >= 0) {
      // Update existing modal data
      setMinimizedModals((prev) => {
        const updated = [...prev]
        updated[existingModalIndex] = { ...updated[existingModalIndex], title, data }
        return updated
      })
    } else {
      // Add new minimized modal
      setMinimizedModals((prev) => [...prev, { id, type, title, data }])
    }

    // Remove from active modals
    setActiveModals((prev) => prev.filter((modalId) => modalId !== id))
  }

  // Function to restore a minimized modal
  const restoreModal = (id: string) => {
    // Add to active modals
    setActiveModals((prev) => [...prev, id])

    // Keep in minimized list so we have the data
    // We'll check activeModals to determine if it should be shown as minimized
  }

  // Function to close a modal completely
  const closeModal = (id: string) => {
    setMinimizedModals((prev) => prev.filter((modal) => modal.id !== id))
    setActiveModals((prev) => prev.filter((modalId) => modalId !== id))
  }

  // Function to get all minimized modals
  const getMinimizedModals = () => {
    return minimizedModals
  }

  // Function to check if a modal is minimized
  const isModalMinimized = (id: string) => {
    return minimizedModals.some((modal) => modal.id === id) && !activeModals.includes(id)
  }

  return (
    <ModalContext.Provider
      value={{
        minimizeModal,
        restoreModal,
        closeModal,
        getMinimizedModals,
        isModalMinimized,
      }}
    >
      {children}
      <MinimizedModalsBar />
    </ModalContext.Provider>
  )
}

// Component to display minimized modals at the bottom of the screen
const MinimizedModalsBar = () => {
  const { getMinimizedModals, restoreModal, closeModal, isModalMinimized } = useModalManager()
  const minimizedModals = getMinimizedModals().filter((modal) => isModalMinimized(modal.id))

  if (minimizedModals.length === 0) return null

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 2,
        p: 1,
        zIndex: 1200,
      }}
    >
      <AnimatePresence>
        {minimizedModals.map((modal) => (
          <motion.div
            key={modal.id}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                borderRadius: "8px 8px 0 0",
                background: "linear-gradient(90deg, #E91E63, #FF5722)",
                color: "white",
                width: { xs: "90vw", sm: 300 },
                maxWidth: "90vw",
              }}
            >
              {modal.type === "musicPlayer" ? <MusicNoteIcon sx={{ mr: 1 }} /> : <CloudUploadIcon sx={{ mr: 1 }} />}

              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  fontWeight: "medium",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer", // Add cursor pointer to indicate it's clickable
                }}
                onClick={() => restoreModal(modal.id)} // Add click handler to restore on title click
              >
                {modal.title}
              </Typography>

              <IconButton
                size="small"
                onClick={() => restoreModal(modal.id)}
                sx={{ color: "white", mr: 0.5 }}
                aria-label="Restore"
              >
                <OpenInFullIcon fontSize="small" />
              </IconButton>

              <IconButton size="small" onClick={() => closeModal(modal.id)} sx={{ color: "white" }} aria-label="Close">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  )
}

export default ModalManagerProvider
