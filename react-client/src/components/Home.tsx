import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { MusicNote, LibraryMusic, PlaylistAdd, Star } from "@mui/icons-material";

const Home = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "white", textAlign: "center", pt: 10 }}>
      {/* כותרת דינמית */}
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Welcome to AI Music Player
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.8 }}>
          Discover, Play, and Personalize Your Music Experience
        </Typography>
      </motion.div>

      {/* כפתורים לגישה מהירה */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="center" mt={4}>
        {[
          { icon: <LibraryMusic />, text: "Explore Library" },
          { icon: <PlaylistAdd />, text: "Create Playlist" },
          { icon: <MusicNote />, text: "Trending Songs" }
        ].map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.1 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#E91E63",
                "&:hover": { bgcolor: "#d81b60" },
                fontSize: "1.1rem",
                fontWeight: "bold",
                display: "flex",
                gap: 1,
              }}
            >
              {item.icon} {item.text}
            </Button>
          </motion.div>
        ))}
      </Stack>

      {/* למה לבחור בנו */}
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Why Choose AI Music Player?
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="center" mt={4}>
          {[
            { icon: <Star fontSize="large" />, text: "AI-Powered Recommendations" },
            { icon: <LibraryMusic fontSize="large" />, text: "Huge Song Library" },
            { icon: <PlaylistAdd fontSize="large" />, text: "Custom Playlists" }
          ].map((item, index) => (
            <motion.div key={index} whileHover={{ scale: 1.1 }}>
              <Box sx={{ p: 3, bgcolor: "#1e1e1e", borderRadius: 3, textAlign: "center" }}>
                {item.icon}
                <Typography variant="h6" mt={1}>{item.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
