"use client"

import type React from "react"

import { useState } from "react"
import { TextField, Button, Box, Chip, Typography, CircularProgress, InputAdornment } from "@mui/material"
import { motion } from "framer-motion"
import { MusicNote, Send, History } from "@mui/icons-material"

interface MoodInputProps {
  onSubmit: (mood: string) => void
  loading: boolean
  recentMoods: string[]
  onQuickMoodSelect: (mood: string) => void
}

const MoodInput = ({ onSubmit, loading, recentMoods, onQuickMoodSelect }: MoodInputProps) => {
  const [moodInput, setMoodInput] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodInput(e.target.value)
  }

  const handleSubmit = () => {
    if (!moodInput.trim()) return
    onSubmit(moodInput)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  // Common mood suggestions
  const moodSuggestions = [
    "Happy",
    "Sad",
    "Energetic",
    "Relaxed",
    "Focused",
    "Romantic",
    "Nostalgic",
    "Excited",
    "Calm",
    "Motivated",
  ]

  return (
    <Box>
      <TextField
        label="How are you feeling today?"
        variant="outlined"
        fullWidth
        value={moodInput}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <MusicNote sx={{ color: "#E91E63" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !moodInput.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          sx={{
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
            color: "white",
            fontWeight: "bold",
            padding: "10px 24px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
              boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
            },
            "&:disabled": {
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              opacity: 0.6,
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Analyzing..." : "Find My Song"}
        </Button>
      </Box>

      {/* Mood Suggestions */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          Suggested moods:
        </Typography>
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
        >
          {moodSuggestions.map((mood) => (
            <Chip
              key={mood}
              label={mood}
              onClick={() => onQuickMoodSelect(mood)}
              sx={{
                background: "linear-gradient(90deg, rgba(233, 30, 99, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%)",
                border: "1px solid rgba(233, 30, 99, 0.2)",
                color: "#E91E63",
                fontWeight: "medium",
                "&:hover": {
                  background: "linear-gradient(90deg, rgba(233, 30, 99, 0.2) 0%, rgba(255, 87, 34, 0.2) 100%)",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <History fontSize="small" /> Recent moods:
          </Typography>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
          >
            {recentMoods.map((mood) => (
              <Chip
                key={mood}
                label={mood}
                onClick={() => onQuickMoodSelect(mood)}
                sx={{
                  background: "linear-gradient(90deg, rgba(233, 30, 99, 0.05) 0%, rgba(255, 87, 34, 0.05) 100%)",
                  border: "1px solid rgba(233, 30, 99, 0.1)",
                  color: "#E91E63",
                  "&:hover": {
                    background: "linear-gradient(90deg, rgba(233, 30, 99, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default MoodInput
