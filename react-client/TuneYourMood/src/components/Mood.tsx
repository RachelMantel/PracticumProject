import { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Card, CardContent, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";

const Mood = () => {
  const [moodInput, setMoodInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState<any>(null);

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
    try {
      // שליחה ל-AI
      // const aiResponse = await axios.post("http://127.0.0.1:5000/predict", 
      //   { text: moodInput }, 
      //   { headers: { 'Content-Type': 'application/json' } }
      // );      
      // setAiResponse(aiResponse.data.moodCategory); // מקבלים את הקטגוריה מהמכונה
    
      // console.log(aiResponse.data.moodCategory);

      // const songResponse = await axios.get(
      //   `https://localhost:7238/api/Song/random-song-by-mood`, 
      //   {
      //     params: { mood: aiResponse.data.moodCategory }, // שליחה בתוך ה-query string
      //     headers: getAuthHeaders(),
      //   }
      // );

      const songResponse = await axios.get(
        `https://localhost:7238/api/Song/random-song-by-mood`, 
        {
          params: { mood: "relaxed" }, // שליחה בתוך ה-query string
          headers: getAuthHeaders(),
        }
      );

      console.log(songResponse)
      setSong(songResponse.data); 

    } catch (error) {
      console.error("Error sending mood to AI:", error);
      setAiResponse("Error analyzing mood");
    }
    setLoading(false);
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      gap={2} 
      p={3} 
      sx={{height: "100vh", color: "white" }}
    >
      <Typography variant="h6" fontWeight="bold" color="#E91E63">
        What’s your mood today?
      </Typography>
      <TextField
        label="Enter your mood"
        variant="outlined"
        fullWidth
        value={moodInput}
        onChange={handleChange}
        sx={{
          "& .MuiInputBase-root": { backgroundColor: "#fff", color: "#212121" },
          "& .MuiOutlinedInput-root": { borderColor: "#E91E63" },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#E91E63" },
        }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit} 
        disabled={loading}
        sx={{ backgroundColor: "#E91E63", "&:hover": { backgroundColor: "#D81B60" } }}
      >
        Send to AI
      </Button>
      {loading && <CircularProgress sx={{ color: "#E91E63" }} />}

      {aiResponse && (
        <Typography variant="h6" sx={{ color: "#E91E63" }}>
          {aiResponse}
        </Typography>
      )}

      {/* הצגת השיר בצורה כמו ברשימת השירים */}
      {song && (
        <Stack spacing={2} mt={3}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "#212121", color: "white" }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{song.songName}</Typography>
              <Typography variant="body2" color="gray">
                {song.artist}
              </Typography>
            </CardContent>
            <Button
              sx={{ backgroundColor: "#E91E63", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#D81B60" } }}
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={() => window.open(song.filePath, "_blank")}
            >
              Play
            </Button>
          </Card>
        </Stack>
      )}
    </Box>
  );
};

export default Mood;

