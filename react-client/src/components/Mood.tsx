import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Card, CardContent, Stack, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";
import MusicPlayer from "./songs/MusicPlayer";

const Mood = () => {
  const [moodInput, setMoodInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodInput(e.target.value);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async () => {
    if (!moodInput.trim()) return;

    setLoading(true);
    setAiResponse("");
    setSong(null);

    try {
      const aiResponse = await axios.post("http://127.0.0.1:5000/predict",
        { text: moodInput },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAiResponse(aiResponse.data.moodCategory);
    } catch (error) {
      console.error("Error sending mood to AI:", error);
      setAiResponse("Could not determine mood.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSong = async () => {
      if (!aiResponse) return;

      try {
        const songResponse = await axios.get(
          `https://localhost:7238/api/Song/random-song-by-mood`,
          {
            params: { mood: aiResponse },
            headers: getAuthHeaders(),
          }
        );
        setSong(songResponse.data);
      } catch (error) {
        console.error("Error fetching song:", error);
        setSong(null);
      }
    };

    if (aiResponse) {
      fetchSong();
    }
  }, [aiResponse]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      p={3}
      sx={{ height: "100vh", backgroundColor: "#fafafa", textAlign: "center", overflow: "auto" }}
    >
      <Typography variant="h4" fontWeight="bold" color="#E91E63" sx={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        What’s your mood today? 
      </Typography>

      <TextField
        label="Enter your mood"
        variant="outlined"
        fullWidth
        value={moodInput}
        onChange={handleChange}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "15px",
          "& .MuiInputBase-root": { borderRadius: "10px" },
          "& .MuiInputLabel-root": { color: "#E91E63" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#E91E63" },
            "&:hover fieldset": { borderColor: "#D81B60" },
          },
          mb: 2
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          backgroundColor: "#E91E63",
          "&:hover": { backgroundColor: "#D81B60" },
          borderRadius: "20px",
          padding: "12px 25px",
          fontSize: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      >
        Send to AI 🧠
      </Button>

      {loading && (
        <CircularProgress sx={{ color: "#E91E63", mt: 2 }} />
      )}

      {aiResponse && (
        <Typography variant="h5" sx={{ color: "#E91E63", fontWeight: "bold", mt: 2 }}>
          {aiResponse === "happy" ? "😊 happy!" :
            aiResponse === "sad" ? "😢 sad!" :
              aiResponse === "excited" ? "🤩 excited!" :
                aiResponse === "angry" ? "😠 angry!" :
                  aiResponse === "relaxed" ? "😌 relaxed!" :
                    aiResponse === "hopeful" ? "🌟  hopeful!" :
                      aiResponse === "grateful" ? "🙏 grateful!" :
                        aiResponse === "nervous" ? "😬 nervous!" : "Neutral 😐!"}
        </Typography>
      )}

      {song && (
        <Stack spacing={3} mt={3} sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
          <Card sx={{
            maxWidth: 500, // הגבלת הרוחב של הכרטיס
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            p: 2,
            bgcolor: "#fff",
            color: "black",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "0.3s",
            "&:hover": { boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }
          }}>
            <CardContent sx={{ flex: 1, paddingRight: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>{song.songName}</Typography>
              <Typography variant="body2" sx={{ color: "gray", fontStyle: "italic" }}>{song.artist}</Typography>
            </CardContent>
            <IconButton
              sx={{
                color: "white",
                bgcolor: "#E91E63",
                margin: "8px",
                transition: "0.3s",
                "&:hover": { bgcolor: "#D81B60" },
                borderRadius: "50%",
                padding: "10px"
              }}
              onClick={() => setIsPlayerOpen(true)}
            >
              <PlayArrowIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Card>
        </Stack>

      )}

      {isPlayerOpen && song && (
        <MusicPlayer song={song} onClose={() => setIsPlayerOpen(false)} />
      )}
    </Box>
  );
};

export default Mood;
