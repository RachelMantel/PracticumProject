import React, { useState } from "react";
import axios from "axios";
import { Button, LinearProgress, Typography, Box, Paper, TextField, MenuItem, Container } from "@mui/material";

export type SongType = {
  songName: string;
  artist: string;
  playlistName?: string;
  filePath: string;
  moodCategory: string;
};

const moodChoices = ["happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"];

const API_BASE_URL = "https://localhost:7238/api/Song/";

const SongUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [songDetails, setSongDetails] = useState<SongType>({
    songName: "",
    artist: "",
    playlistName: "",
    filePath: "",
    moodCategory: "happy",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setSongDetails((prev) => ({ ...prev, filePath: file.name }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSongDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const response = await axios.get(`${API_BASE_URL}upload-url`, {
        params: { fileName: file.name, contentType: file.type },
        headers: getAuthHeaders(),
      });

      const presignedUrl = response.data.url;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });

      const downloadResponse = await axios.get(`${API_BASE_URL}download-url/${encodeURIComponent(file.name)}`,
        { headers: getAuthHeaders() }
      );
      setFileUrl(downloadResponse.data.downloadUrl);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 5, backgroundColor: "#fff", color: "#000" }}>
        <Typography variant="h5" gutterBottom color="#E91E63">
          Upload a Song
        </Typography>
        <TextField fullWidth label="Song Name" name="songName" value={songDetails.songName} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Artist" name="artist" value={songDetails.artist} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Playlist Name" name="playlistName" value={songDetails.playlistName} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth select label="Mood Category" name="moodCategory" value={songDetails.moodCategory} onChange={handleChange} sx={{ mb: 2 }}>
          {moodChoices.map((choice) => (
            <MenuItem key={choice} value={choice}>{choice}</MenuItem>
          ))}
        </TextField>
        <input type="file" onChange={handleFileChange} style={{ marginBottom: 15 }} />
        <Box mt={2}>
          <Button variant="contained" sx={{ backgroundColor: "#E91E63", color: "#fff" }} onClick={handleUpload} disabled={!file}>
            Upload File
          </Button>
        </Box>
        {progress > 0 && (
          <Box mt={2}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" mt={1}>{`Progress: ${progress}%`}</Typography>
          </Box>
        )}
        {fileUrl && (
          <Box mt={3}>
            <Typography variant="h6" color="#E91E63">Uploaded File:</Typography>
            <Button variant="outlined" href={fileUrl} target="_blank" rel="noopener noreferrer">
              View File
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SongUploader;
