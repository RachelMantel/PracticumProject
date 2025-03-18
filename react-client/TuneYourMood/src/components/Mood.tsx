import { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";

const Mood = () => {
  const [moodInput, setMoodInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!moodInput.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", { text: moodInput });
      setAiResponse(response.data.moodCategory); // Get the mood category from the server response
    } catch (error) {
      console.error("Error sending mood to AI:", error);
      setAiResponse("Error analyzing mood");
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={3}>
      <Typography variant="h6" fontWeight="bold" color="primary">
        What’s your mood today?
      </Typography>
      <TextField
        label="Enter your mood"
        variant="outlined"
        fullWidth
        value={moodInput}
        onChange={handleChange}
        sx={{
          "& .MuiInputBase-root": { backgroundColor: "#fff" },
        }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
        Send to AI
      </Button>
      {loading && <CircularProgress />}
      {aiResponse && (
        <Typography variant="h6" color="secondary">
          AI detected: {aiResponse}
        </Typography>
      )}
    </Box>
  );
};

export default Mood;
