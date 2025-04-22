import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Button, LinearProgress, Typography, Box, Paper, TextField, MenuItem, Container } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { addSong } from "../redux/SongSlice";
import { SongType } from "../../models/songType";
import { AppDispatch } from "../redux/store";
import { UserType } from "../../models/userType";

const moodChoices = ["natural","happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"];
const API_BASE_URL = "https://localhost:7238/api/Song/";

interface SongUploaderProps {  
  onUploadSuccess?: () => void;  // שינוי: הוספת פרופ לסגירת המודל לאחר ההעלאה
}

const SongUploader: React.FC<SongUploaderProps> = ({ onUploadSuccess }) => {  // שינוי: שימוש בפרופ
  const userString = localStorage.getItem("user");
  const user: UserType | null = userString ? JSON.parse(userString) : null;
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [songDetails, setSongDetails] = useState<SongType>({
    songName: "",
    artist: "",
    filePath: "",
    mood_category: "happy",
    userId: user?.id ?? 1,
    folderId:-1,
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSongDetails((prev) => ({ ...prev, SongName: selectedFile.name }));
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
      console.log("Presigned URL:", presignedUrl);

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });

      const downloadResponse = await axios.get(`${API_BASE_URL}download-url/${encodeURIComponent(file.name)}`, {
        headers: getAuthHeaders(),
      });

      const uploadedFileUrl = downloadResponse.data.downloadUrl;
      setFileUrl(uploadedFileUrl);

      const newSong: SongType = {
        ...songDetails,
        filePath: uploadedFileUrl,
      };

      dispatch(addSong(newSong));

      if (onUploadSuccess) {  // שינוי: קריאה לפונקציה שסוגרת את המודל לאחר ההעלאה
        onUploadSuccess();
        // window.location.reload();
      }

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

        <TextField
          fullWidth
          label="artist"
          name="artist"
          value={songDetails.artist}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="mood Category"
          name="mood_category"
          value={songDetails.mood_category}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {moodChoices.map((choice) => (
            <MenuItem key={choice} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </TextField>

        {/* כפתור בחירת קובץ מעוצב */}
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{
            backgroundColor: "#E91E63",
            color: "#fff",
            mb: 2,
            width: "100%",
            padding: "10px",
          }}
        >
          Choose File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {/* הצגת שם הקובץ הנבחר */}
        {file && (
          <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
            Selected File: {file.name}
          </Typography>
        )}

        <Box mt={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#E91E63", color: "#fff", width: "100%" }}
            onClick={handleUpload}
            disabled={!file}
          >
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
            <Typography variant="h6" color="#E91E63">
              Uploaded File:
            </Typography>
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
