"use client"

import type React from "react"
import { useState, useRef } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import {
  Button,
  LinearProgress,
  Typography,
  Box,
  Paper,
  TextField,
  MenuItem,
  Container,
  Fade,
  Grow,
  Slide,
} from "@mui/material"
import { motion } from "framer-motion"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic"
import { addSong } from "../redux/SongSlice"
import type { SongType } from "../../models/songType"
import type { AppDispatch } from "../redux/store"
import type { UserType } from "../../models/userType"

const moodChoices = ["natural", "happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]
const API_BASE_URL = "https://localhost:7238/api/Song/"

interface SongUploaderProps {
  onUploadSuccess?: () => void
}

const SongUploader: React.FC<SongUploaderProps> = ({ onUploadSuccess }) => {
  const userString = localStorage.getItem("user")
  const user: UserType | null = userString ? JSON.parse(userString) : null
  const dispatch = useDispatch<AppDispatch>()
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [, setFileUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [songDetails, setSongDetails] = useState<SongType>({
    songName: "",
    artist: "",
    filePath: "",
    mood_category: "happy",
    userId: user?.id ?? 1,
    folderId: -1,
  })

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Extract song name from file name (remove extension)
      const songName = selectedFile.name.replace(/\.[^/.]+$/, "")
      setSongDetails((prev) => ({ ...prev, songName }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSongDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      // Extract song name from file name (remove extension)
      const songName = droppedFile.name.replace(/\.[^/.]+$/, "")
      setSongDetails((prev) => ({ ...prev, songName }))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const response = await axios.get(`${API_BASE_URL}upload-url`, {
        params: { fileName: file.name, contentType: file.type },
        headers: getAuthHeaders(),
      })

      const presignedUrl = response.data.url

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })

      const downloadResponse = await axios.get(`${API_BASE_URL}download-url/${encodeURIComponent(file.name)}`, {
        headers: getAuthHeaders(),
      })

      const uploadedFileUrl = downloadResponse.data.downloadUrl
      setFileUrl(uploadedFileUrl)

      const newSong: SongType = {
        ...songDetails,
        filePath: uploadedFileUrl,
      }

      dispatch(addSong(newSong))
      setUploadComplete(true)

      // Delay to show success animation
      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      }, 1500)
    } catch (error) {
      console.error("Upload error:", error)
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Container maxWidth="sm" sx={{ position: "relative" }}>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: "center",
            marginTop: 5,
            backgroundColor: "#ffffff",
            color: "#333",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(233,30,99,0.1)",
          }}
        >
          {/* Background elements */}
          <Box
            sx={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(233,30,99,0.05) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,87,34,0.05) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              component={motion.div}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <LibraryMusicIcon
                sx={{
                  fontSize: 40,
                  color: "#E91E63",
                  mr: 1,
                  filter: "drop-shadow(0 0 8px rgba(233,30,99,0.3))",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #E91E63, #FF5722)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Upload Music
              </Typography>
            </Box>

            <Grow in={true} timeout={800}>
              <Box>
                <TextField
                  fullWidth
                  label="Artist"
                  name="artist"
                  value={songDetails.artist}
                  onChange={handleChange}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: "rgba(233,30,99,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(233,30,99,0.4)",
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

                <TextField
                  fullWidth
                  select
                  label="Mood Category"
                  name="mood_category"
                  value={songDetails.mood_category}
                  onChange={handleChange}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: "rgba(233,30,99,0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(233,30,99,0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#E91E63",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#E91E63",
                    },
                  }}
                >
                  {moodChoices.map((choice) => (
                    <MenuItem key={choice} value={choice}>
                      {choice}
                    </MenuItem>
                  ))}
                </TextField>

                {/* File upload area with drag & drop */}
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  sx={{
                    border: `2px dashed ${dragActive ? "#E91E63" : "rgba(233,30,99,0.3)"}`,
                    borderRadius: "16px",
                    padding: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: dragActive ? "rgba(233,30,99,0.05)" : "rgba(233,30,99,0.02)",
                    transition: "all 0.3s ease",
                    mb: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "150px",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="audio/*"
                  />

                  <CloudUploadIcon
                    sx={{
                      fontSize: 50,
                      color: "#E91E63",
                      mb: 2,
                      filter: "drop-shadow(0 0 5px rgba(233,30,99,0.3))",
                    }}
                  />

                  <Typography variant="h6" sx={{ color: "#555", mb: 1 }}>
                    {file ? "Change File" : "Drop your audio file here"}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)" }}>
                    or click to browse
                  </Typography>

                  {file && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: "rgba(233,30,99,0.05)",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <MusicNoteIcon sx={{ color: "#E91E63", mr: 1 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Song name field - only show after file selection */}
                {file && (
                  <Fade in={!!file}>
                    <TextField
                      fullWidth
                      label="Song Name"
                      name="songName"
                      value={songDetails.songName}
                      onChange={handleChange}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: "rgba(233,30,99,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(233,30,99,0.4)",
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
                  </Fade>
                )}

                {/* Upload button */}
                <Box mt={2}>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    disabled={!file || uploading || uploadComplete}
                    onClick={handleUpload}
                    sx={{
                      background: "linear-gradient(90deg, #E91E63, #FF5722)",
                      color: "#fff",
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 4px 20px rgba(233,30,99,0.2)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #D81B60, #F4511E)",
                        boxShadow: "0 6px 25px rgba(233,30,99,0.3)",
                      },
                      "&:disabled": {
                        background: "rgba(233,30,99,0.2)",
                        color: "rgba(255,255,255,0.8)",
                      },
                    }}
                    startIcon={<CloudUploadIcon />}
                  >
                    {uploading ? "Uploading..." : uploadComplete ? "Upload Complete" : "Upload Song"}
                  </Button>
                </Box>

                {/* Progress bar */}
                {uploading && (
                  <Box mt={3}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(233,30,99,0.1)",
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #E91E63, #FF5722)",
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: "rgba(0,0,0,0.6)" }}>
                      {`${progress}% Uploaded`}
                    </Typography>
                  </Box>
                )}

                {/* Success message */}
                {uploadComplete && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: "rgba(46,125,50,0.1)",
                      border: "1px solid rgba(46,125,50,0.2)",
                    }}
                  >
                    <Typography sx={{ color: "#2e7d32" }}>Song uploaded successfully!</Typography>
                  </Box>
                )}
              </Box>
            </Grow>
          </Box>
        </Paper>
      </Slide>
    </Container>
  )
}

export default SongUploader
