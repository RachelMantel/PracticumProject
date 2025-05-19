"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Paper } from "@mui/material"
import { motion } from "framer-motion"
import axios from "axios"
import MoodInput from "./MoodInput"
import MoodResult from "./MoodResult"
import MusicPlayer from "../songs/MusicPlayer"
import SongRecommendation from "./SongRecommendation"

const Mood = () => {
  const [, setMoodInput] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [song, setSong] = useState<any>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [recentMoods, setRecentMoods] = useState<string[]>([])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleMoodSubmit = async (mood: string) => {
    if (!mood.trim()) return

    setMoodInput(mood)
    setLoading(true)
    setAiResponse("")
    setSong(null)
    setError("")

    try {
      const aiResponse = await axios.post(
        "https://tuneyourmood-ai-server.onrender.com/predict",
        { text: mood },
        { headers: { "Content-Type": "application/json" } },
      )

      
      const moodCategory = aiResponse.data.moodCategory
      console.log(moodCategory);

      setAiResponse(moodCategory)

      // Add to recent moods if not already present
      setRecentMoods((prev) => {
        const updatedMoods = [moodCategory, ...prev.filter((m) => m !== moodCategory)]
        return updatedMoods.slice(0, 5) // Keep only the 5 most recent moods
      })
    } catch (error) {
      console.error("Error sending mood to AI:", error)
      setError("Could not determine your mood. Please try again.")
      setAiResponse("")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickMoodSelect = (mood: string) => {
    setMoodInput(mood)
    handleMoodSubmit(mood)
  }

  useEffect(() => {
    const fetchSong = async () => {
      if (!aiResponse) return

      try {
        const songResponse = await axios.get(`https://tuneyourmood-server.onrender.com/api/Song/random-song-by-mood`, {
          params: { mood: aiResponse },
          headers: getAuthHeaders(),
        })
        setSong(songResponse.data)
      } catch (error) {
        console.error("Error fetching song:", error)
        setError("Could not find a song matching your mood. Please try again.")
        setSong(null)
      }
    }

    if (aiResponse) {
      fetchSong()
    }
  }, [aiResponse])

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        pt: 2,
        pb: 4,
      }}
    >
      {/* Background Elements */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: -1, overflow: "hidden" }}>
        <Box
          component={motion.div}
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
            opacity: 0.05,
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <Box
          component={motion.div}
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "linear-gradient(90deg, #FF5722 0%, #E91E63 100%)",
            opacity: 0.05,
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.05, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <Box
          component={motion.div}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233,30,99,0.05) 0%, rgba(255,87,34,0.05) 50%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            opacity: 0.1,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </Box>

      {/* Header */}
      <Box component={motion.div} variants={itemVariants} sx={{ textAlign: "center", mb: 4, px: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Music Mood Matcher
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto" }}>
          Tell us how you're feeling, and we'll find the perfect song to match your mood
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          px: 2,
          flex: 1,
        }}
      >
        {/* Mood Input Section - Full Width */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "900px",
            p: { xs: 3, md: 5 },
            borderRadius: "24px",
            background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
            position: "relative",
            overflow: "hidden",
            mb: 4,
          }}
        >
          <MoodInput
            onSubmit={handleMoodSubmit}
            loading={loading}
            recentMoods={recentMoods}
            onQuickMoodSelect={handleQuickMoodSelect}
          />
        </Paper>

        {/* Error Message */}
        {error && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ mt: 3, textAlign: "center", width: "100%", maxWidth: "900px" }}
          >
            <Typography color="error" variant="body1">
              {error}
            </Typography>
          </Box>
        )}

        {/* Results Section - Compact Layout */}
        {aiResponse && !error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            {/* Compact Mood Result */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                width: { xs: "100%", md: "30%" },
                maxWidth: { xs: "450px", md: "none" },
              }}
            >
              <MoodResult mood={aiResponse} compact={true} />
            </Box>

            {/* Song Recommendation */}
            {song && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                sx={{
                  width: { xs: "100%", md: "70%" },
                  maxWidth: { xs: "600px", md: "none" },
                }}
              >
                <SongRecommendation song={song} onPlay={() => setIsPlayerOpen(true)} />
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Music Player */}
      {isPlayerOpen && song && <MusicPlayer song={song} onClose={() => setIsPlayerOpen(false)} />}
    </Box>
  )
}

export default Mood
