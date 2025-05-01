import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserSongs } from "../redux/SongSlice"
import {Box,Button,Typography,CircularProgress,Dialog,IconButton,useMediaQuery,
useTheme,Paper,InputBase,} from "@mui/material"
import { motion } from "framer-motion"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import SearchIcon from "@mui/icons-material/Search"
import ShowSongs from "./ShowSongs"
import SongUploader from "./SongUploader"

const AllSongs = () => {
  const dispatch = useDispatch()
  const songs = useSelector((state: any) => state.songs?.songs || [])
  const loading = useSelector((state: any) => state.songs?.loading || false)
  const error = useSelector((state: any) => state.songs?.error || null)
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"))
  const [isUploadOpen, setUploadOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserSongs(user.id) as any)
    }
  }, [dispatch, user])

  const handleCloseUpload = () => {
    setUploadOpen(false)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredSongs = songs.filter((song: any) => {
    const query = searchQuery.toLowerCase()
    return (
      song.songName?.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query) ||
      song.mood_category?.toLowerCase().includes(query)
    )
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  if (loading) {
    return (
      <Box>       
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <CircularProgress
            sx={{
              color: "#E91E63",
              mb: 3,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
            size={60}
          />

          <Typography
            variant="h5"
            sx={{
              color: "#333",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #E91E63, #FF5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loading your music collection...
          </Typography>

          <Box
            component={motion.div}
            animate={{
              opacity: [0.5, 1, 0.5],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)" }}>
              Preparing your beats and rhythms
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: "rgba(211,47,47,0.05)",
          border: "1px solid rgba(211,47,47,0.2)",
          textAlign: "center",
        }}
      >
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Please try refreshing the page or contact support.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        width: "100%",
        position: "relative",
        pb: 4,
      }}
    >
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
          <LibraryMusicIcon
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
            My Music Collection
          </Typography>
        </Box>

        <Button
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadOpen(true)}
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
          Add New Song
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
          gap: 2,
        }}
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
            flex: { xs: 1, sm: 0.7 },
          }}
        >
          <SearchIcon sx={{ color: "rgba(0,0,0,0.4)", mr: 1 }} />
          <InputBase
            placeholder="Search songs, artists, or moods..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flex: 1 }}
          />
        </Paper>
      </Box>

      
      {/* Songs List */}
      <Box component={motion.div} variants={itemVariants}>
        {filteredSongs.length > 0 ? (
          <ShowSongs songs={filteredSongs} />
        ) : (
          <Box
            sx={{
              p: 6,
              borderRadius: "16px",
              backgroundColor: "rgba(0,0,0,0.02)",
              border: "1px dashed rgba(0,0,0,0.15)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 60, color: "rgba(0,0,0,0.2)", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#555", mb: 1 }}>
              {searchQuery ? "No matching songs found" : "Your collection is empty"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)", mb: 3 }}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Add your first song to start building your music library"}
            </Typography>
            {!searchQuery && (
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setUploadOpen(true)}
                sx={{
                  color: "#E91E63",
                  borderColor: "rgba(233,30,99,0.5)",
                  "&:hover": {
                    borderColor: "#E91E63",
                    backgroundColor: "rgba(233,30,99,0.05)",
                  },
                }}
              >
                Upload Your First Song
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Upload Dialog */}
      <Dialog
        open={isUploadOpen}
        onClose={handleCloseUpload}
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={handleCloseUpload}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              color: "#E91E63",
              "&:hover": {
                backgroundColor: "rgba(233,30,99,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <SongUploader onUploadSuccess={handleCloseUpload} />
        </Box>
      </Dialog>
    </Box>
  )
}

export default AllSongs
