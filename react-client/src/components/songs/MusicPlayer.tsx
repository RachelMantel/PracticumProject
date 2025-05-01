"use client"

import { Paper, Typography, IconButton, Box, Slider } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type { SongType } from "../../models/songType"
import { useState, useRef, useEffect } from "react"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import VolumeDownIcon from "@mui/icons-material/VolumeDown"
import VolumeMuteIcon from "@mui/icons-material/VolumeMute"
import { motion } from "framer-motion"
import { createPortal } from "react-dom"

interface MusicPlayerProps {
  song: SongType
  onClose: () => void
}

const MusicPlayer = ({ song, onClose }: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Create a portal element at the document body level
    const element = document.createElement("div")
    element.id = "music-player-portal"
    document.body.appendChild(element)
    setPortalElement(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    // Auto-play when component mounts
    audio.play().catch((error) => {
      console.error("Auto-play failed:", error)
      setIsPlaying(false)
    })

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const newVolume = newValue as number
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const newTime = newValue as number
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const playerContent = (
    <>
      {/* Background overlay */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(5px)",
          zIndex: 1000,
        }}
      />

      {/* Player */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1100,
          width: { xs: "90%", sm: "500px" },
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            backgroundColor: "white",
          }}
        >
          {/* Header with gradient */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              color: "white",
              p: 2,
              position: "relative",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Now Playing
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4, textAlign: "center" }}>
            {/* Album art / music icon */}
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.1, 1] : 1,
                rotate: isPlaying ? [0, 10, 0] : 0,
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            >
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  margin: "0 auto 24px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  border: "4px solid white",
                }}
              >
                🎵
              </Box>
            </motion.div>

            {/* Song info */}
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {song.songName}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 3 }}>
              {song.artist}
            </Typography>

            {/* Audio controls */}
            <Box sx={{ mb: 2 }}>
              <audio ref={audioRef} src={song.filePath} />

              {/* Progress bar */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="caption" sx={{ mr: 1, color: "text.secondary" }}>
                  {formatTime(currentTime)}
                </Typography>
                <Slider
                  value={currentTime}
                  max={duration || 100}
                  onChange={handleSeek}
                  sx={{
                    color: "#E91E63",
                    "& .MuiSlider-thumb": {
                      width: 12,
                      height: 12,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                  {formatTime(duration)}
                </Typography>
              </Box>

              {/* Play/Pause button */}
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  backgroundColor: "#E91E63",
                  color: "white",
                  "&:hover": { backgroundColor: "#d81b60" },
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              {/* Volume control */}
              <Box sx={{ display: "flex", alignItems: "center", width: "80%", margin: "0 auto" }}>
                <IconButton onClick={() => setVolume(0)} sx={{ color: "text.secondary" }}>
                  {volume === 0 ? <VolumeMuteIcon /> : volume < 0.5 ? <VolumeDownIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                  value={volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleVolumeChange}
                  sx={{
                    color: "#E91E63",
                    "& .MuiSlider-thumb": {
                      width: 12,
                      height: 12,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  )

  // Render the player in a portal to avoid layout issues
  return portalElement ? createPortal(playerContent, portalElement) : null
}

export default MusicPlayer
