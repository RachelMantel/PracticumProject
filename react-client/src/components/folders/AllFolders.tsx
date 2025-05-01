import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import type { AppDispatch } from "../redux/store"
import { fetchUserFolders, addFolder } from "../redux/FolderSlice"
import type { FolderType } from "../../models/folderType"
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material"
import { Add as AddIcon, Search as SearchIcon, LibraryMusic, Album } from "@mui/icons-material"
import FolderCard from "./FolderCard"
import FolderDialog from "./FolderDialog"

const AllFolders = () => {
  const dispatch = useDispatch<AppDispatch>()
  const folders = useSelector((state: any) => state.folders?.folders || [])
  const [openFolderDialog, setOpenFolderDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFolders = async () => {
      await dispatch(fetchUserFolders())
      setIsLoading(false)
    }
    loadFolders()
  }, [dispatch])

  const handleAddFolder = async (folderName: string) => {
    const userId = JSON.parse(localStorage.getItem("user") || "null")?.id
    const newFolder: FolderType = {
      parentId: -1,
      folderName: folderName,
      userId: userId,
      songs: [],
    }

    await dispatch(addFolder(newFolder))
    dispatch(fetchUserFolders())
    setOpenFolderDialog(false)
  }

  const filteredFolders = folders.filter((folder: FolderType) =>
    folder.folderName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <Box sx={{ px: 3, py: 4, width: "100%" }}>
      {/* Header - Matching AllSongs style */}
      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Album
            sx={{
              fontSize: { xs: 28, md: 32 },
              color: "#E91E63",
              mr: 1.5,
              filter: "drop-shadow(0 0 8px rgba(233,30,99,0.2))",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #E91E63, #FF5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.5rem", md: "1.8rem" },
            }}
          >
            My Playlists
          </Typography>
        </Box>

        <Button
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenFolderDialog(true)}
          sx={{
            background: "linear-gradient(90deg, #E91E63, #FF5722)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(233,30,99,0.2)",
            "&:hover": {
              background: "linear-gradient(90deg, #D81B60, #F4511E)",
              boxShadow: "0 6px 20px rgba(233,30,99,0.3)",
            },
          }}
        >
          Create Playlist
        </Button>
      </Box>

      {/* Search bar with animation */}
      <Box
        component={motion.div}
        variants={itemVariants}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        sx={{ mb: 4 }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 0.5,
            borderRadius: "8px",
            backgroundColor: "rgba(0,0,0,0.03)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <SearchIcon sx={{ color: "rgba(0,0,0,0.4)", mr: 1 }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search your playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Paper>
      </Box>

      {/* Playlists grid with staggered animation */}
      {isLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8 }}>
          <Box sx={{ position: "relative" }}>
            <LibraryMusic sx={{ fontSize: 48, color: "#E91E63" }} className="animate-pulse" />
            <motion.div
              style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #E91E63" }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </Box>
          <Typography sx={{ mt: 2, color: "text.secondary" }}>Loading your playlists...</Typography>
        </Box>
      ) : (
        <AnimatePresence>
          {filteredFolders.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <Grid container spacing={3}>
                {filteredFolders.map((folder: FolderType) => (
                  <Grid item xs={12} sm={6} md={4} key={folder.id}>
                    <motion.div variants={itemVariants}>
                      <FolderCard folder={folder} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 0",
                textAlign: "center",
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <LibraryMusic sx={{ fontSize: 64, color: "text.secondary" }} />
                <motion.div
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.2)" }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                No playlists found
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                {searchTerm ? "Try a different search term" : "Create your first playlist to get started"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenFolderDialog(true)}
                sx={{
                  background: "linear-gradient(90deg, #E91E63, #FF5722)",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(233,30,99,0.2)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #D81B60, #F4511E)",
                    boxShadow: "0 6px 20px rgba(233,30,99,0.3)",
                  },
                }}
              >
                Create Your First Playlist
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <FolderDialog
        open={openFolderDialog}
        onClose={() => setOpenFolderDialog(false)}
        onCreateFolder={handleAddFolder}
      />
    </Box>
  )
}

export default AllFolders
