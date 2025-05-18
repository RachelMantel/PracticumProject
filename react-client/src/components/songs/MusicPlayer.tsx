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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)
  const [audioData, setAudioData] = useState<number[]>(Array(16).fill(0.3))
  const [audioInitialized, setAudioInitialized] = useState(false)

  const primaryColor = "#E91E63" 
  const secondaryColor = "#FF5722" 

  useEffect(() => {
    const element = document.createElement("div")
    element.id = "music-player-portal"
    document.body.appendChild(element)
    setPortalElement(element)

    return () => {
      if (element && document.body.contains(element)) {
        document.body.removeChild(element)
      }
    }
  }, [])

  useEffect(() => {
    if (audioInitialized) return

    const audio = new Audio()
    audioRef.current = audio
    audio.volume = volume

    setAudioInitialized(true)

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [audioInitialized, volume])

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      console.log("Audio duration loaded:", audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(audio.duration)
    }

    const handlePlay = () => {
      console.log("Audio play event")
      setIsPlaying(true)
    }

    const handlePause = () => {
      console.log("Audio pause event")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [audioInitialized])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPlaying) {
      intervalId = setInterval(() => {
        setAudioData((prevData) =>
          prevData.map((value) => {
            const change = Math.random() * 0.2 - 0.1
            return Math.max(0.2, Math.min(0.8, value + change))
          }),
        )
      }, 400) 
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioInitialized) return

    console.log("Loading song:", song.filePath)

    // Reset state
    setCurrentTime(0)

    let songUrl = song.filePath

    try {
      const url = new URL(songUrl)
      const pathParts = url.pathname.split("/")

      if (pathParts.some((part) => part.includes("amazonaws.com"))) {
        console.log("Fixing Amazon URL")
        const fileName = pathParts[pathParts.length - 1]
        const baseUrl = `${url.protocol}//${url.host}`
        songUrl = `${baseUrl}/${fileName}`
      }
    } catch (error) {
      console.log("URL parsing error, using original URL:", error)
    }

    audio.src = songUrl
    audio.load()

    audio
      .play()
      .then(() => {
        console.log("Audio started playing successfully")
        setIsPlaying(true)
      })
      .catch((error) => {
        console.error("Auto-play failed:", error)
        setIsPlaying(false)
      })
  }, [song.filePath, audioInitialized])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    console.log("Play/Pause button clicked. Current state:", isPlaying)

    if (isPlaying) {
      audio.pause()
    } else {
      audio
        .play()
        .then(() => {
          console.log("Play successful from button click")
        })
        .catch((err) => {
          console.error("Play failed from button click:", err)
        })
    }
  }

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const newVolume = newValue as number
    setVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume

      if (!audioRef.current.paused && !isPlaying) {
        setIsPlaying(true)
      }
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"

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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  const musicalNotes = [
    { x: 40, y: 80, size: "1.5rem", color: primaryColor, delay: 0 },
    { x: 40, y: 70, size: "1.8rem", color: secondaryColor, delay: 1 },
    { x: 60, y: 120, size: "1.3rem", color: primaryColor, delay: 0.5 },
    { x: 80, y: 60, size: "1.6rem", color: secondaryColor, delay: 1.5 },
    { x: 100, y: 140, size: "1.4rem", color: primaryColor, delay: 0.7 },
    { x: 120, y: 90, size: "1.7rem", color: secondaryColor, delay: 1.2 },
    { x: 140, y: 110, size: "1.5rem", color: primaryColor, delay: 0.3 },
    { x: 160, y: 70, size: "1.3rem", color: secondaryColor, delay: 0.9 },
  ]

  const playerContent = (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(5px)",
          zIndex: 1000,
        }}
        onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
      >
        <Paper
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: `0 10px 40px ${primaryColor}40`,
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Background elements inspired by mood-result */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              zIndex: 0,
            }}
          />

          {/* Circular glow */}
          <Box
            component={motion.div}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
              zIndex: 0,
            }}
          />

          {/* Header with gradient */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              color: "white",
              p: 2,
              position: "relative",
              zIndex: 1,
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
          <Box sx={{ p: 4, textAlign: "center", position: "relative", zIndex: 1 }}>
            {/* Audio visualization bars - styled like mood-result but SLOWER */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                height: 100,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 1,
                mb: 4,
                mt: 1,
                position: "relative",
              }}
            >
              {audioData.map((value, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: `${10 + value * 80}px`,
                  }}
                  transition={{
                    duration: 0.6, // SLOWER animation
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 5,
                    borderRadius: 4,
                    background: `linear-gradient(to top, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 0 8px ${primaryColor}50`,
                    opacity: 0.9,
                  }}
                />
              ))}

              {/* Glow under the bars */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: 20,
                  borderRadius: "50%",
                  filter: "blur(10px)",
                  background: `radial-gradient(ellipse, ${primaryColor}30 0%, transparent 70%)`,
                }}
              />
            </Box>

            {/* Song info */}
            <motion.div variants={itemVariants}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 0.5,
                  color: "text.primary",
                  textShadow: `0 2px 10px ${primaryColor}20`,
                }}
              >
                {song.songName}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                {song.artist}
              </Typography>
            </motion.div>

            {/* Audio controls */}
            <Box sx={{ mb: 2, position: "relative", zIndex: 2 }}>
              {/* Progress bar */}
              <motion.div variants={itemVariants}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ mr: 1, color: "text.secondary", minWidth: 35, textAlign: "center" }}
                  >
                    {formatTime(currentTime)}
                  </Typography>
                  <Slider
                    value={currentTime}
                    min={0}
                    max={duration || 100}
                    onChange={handleSeek}
                    sx={{
                      color: primaryColor,
                      "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: `0px 0px 0px 8px ${primaryColor}30`,
                        },
                      },
                      "& .MuiSlider-rail": {
                        opacity: 0.3,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ ml: 1, color: "text.secondary", minWidth: 35, textAlign: "center" }}
                  >
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </motion.div>

              {/* Play/Pause button */}
              <motion.div variants={itemVariants} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                <IconButton
                  onClick={handlePlayPause}
                  sx={{
                    backgroundColor: primaryColor,
                    color: "white",
                    "&:hover": { backgroundColor: secondaryColor },
                    width: 56,
                    height: 56,
                    mb: 2,
                    boxShadow: `0 4px 12px ${primaryColor}50`,
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
              </motion.div>

              {/* Volume control */}
              <motion.div variants={itemVariants}>
                <Box sx={{ display: "flex", alignItems: "center", width: "80%", margin: "0 auto" }}>
                  <IconButton onClick={() => setVolume(volume === 0 ? 0.5 : 0)} sx={{ color: "text.secondary" }}>
                    {volume === 0 ? <VolumeMuteIcon /> : volume < 0.5 ? <VolumeDownIcon /> : <VolumeUpIcon />}
                  </IconButton>
                  <Slider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleVolumeChange}
                    sx={{
                      color: primaryColor,
                      "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                      },
                    }}
                  />
                </Box>
              </motion.div>
            </Box>

            {/* Decorative elements inspired by mood-result */}
            <Box
              component={motion.div}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
                zIndex: 0,
              }}
            />

            <Box
              component={motion.div}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              sx={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%)`,
                zIndex: 0,
              }}
            />

            {/* MORE musical notes on the card as requested */}
            {isPlaying &&
              musicalNotes.map((note, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 2, // Varied durations
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: note.delay,
                  }}
                  sx={{
                    position: "absolute",
                    top: note.y,
                    left: note.x,
                    fontSize: note.size,
                    color: note.color,
                    zIndex: 0,
                  }}
                >
                  {["♪", "♫", "♬", "♩"][index % 4]}
                </Box>
              ))}
          </Box>
        </Paper>
      </Box>

      {/* Hidden audio element for debugging */}
      <audio id="debug-audio" ref={audioRef} style={{ display: "none" }} controls />
    </>
  )

  // Render the player in a portal to avoid layout issues
  return portalElement ? createPortal(playerContent, portalElement) : null
}

export default MusicPlayer
