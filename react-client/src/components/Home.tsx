import { Box, Button, Container, Stack, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { MusicNote, LibraryMusic, PlaylistAdd, Star, PersonAdd, Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // תמונה ברירת מחדל

  const colors = ["#3F51B5", "#FF9800", "#009688", "#9C27B0"]; // צבעים שונים לאווטרים

  // תמונה ברירת מחדל
  const defaultAvatar = "https://via.placeholder.com/56?text=No+Image";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", color: "#121212", textAlign: "center", pt: 10, pb: 5 }}>
      
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
        {token ? (
          [
            { icon: <LibraryMusic />, text: "Explore Library", onClick: () => navigate("/my-songs") },
            { icon: <PlaylistAdd />, text: "Create Playlist", onClick: () => navigate("/my-playlists") },
            { icon: <MusicNote />, text: "Clever Search By Mood", onClick: () => navigate("/mood") }
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
                onClick={item.onClick}
              >
                {item.icon} {item.text}
              </Button>
            </motion.div>
          ))
        ) : (
          [
            { icon: <Login />, text: "Login", onClick: () => navigate("/login") },
            { icon: <PersonAdd />, text: "Sign Up", onClick: () => navigate("/register") }
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
                onClick={item.onClick}
              >
                {item.icon} {item.text}
              </Button>
            </motion.div>
          ))
        )}
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
              <Box sx={{ p: 3, bgcolor: "#ffffff", borderRadius: 3, textAlign: "center", boxShadow: 3 }}>
                {item.icon}
                <Typography variant="h6" mt={1}>{item.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Container>

      {/* ביקורות משתמשים עם פרופילים */}
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          What Our Users Say
        </Typography>

        {/* תגובות 1-3 */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="center" mt={4}>
          {[
            { name: "John Doe", text: "This app changed how I listen to music!", img: "" }, // אות
            { name: "Sarah Lee", text: "The AI recommendations are spot on!", img: "https://randomuser.me/api/portraits/women/44.jpg" }, // תמונה
            { name: "Mike Brown", text: "Love the huge variety of songs!", img: "" } // אות
          ].map((review, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }}>
              <Box sx={{ p: 3, bgcolor: "#ffffff", borderRadius: 3, textAlign: "center", boxShadow: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar 
                  src={review.img || defaultAvatar} 
                  sx={{ width: 56, height: 56, bgcolor: review.img ? "transparent" : colors[index % colors.length] }}
                >
                  {/* אם אין תמונה, מציגים את האות הראשונה מהשם */}
                  {!review.img && review.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight={700} mt={2}>{review.name}</Typography>
                <Typography variant="body1" mt={1}>{review.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Stack>

        {/* תגובות 4-5 */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="center" mt={4}>
          {[
            { name: "Anna Smith", text: "The mood-based search is a game-changer!", img: "https://randomuser.me/api/portraits/women/55.jpg" }, // תמונה
            { name: "James Wilson", text: "Such a smooth and enjoyable experience.", img: "" } // תמונה ברירת מחדל
          ].map((review, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }}>
              <Box sx={{ p: 3, bgcolor: "#ffffff", borderRadius: 3, textAlign: "center", boxShadow: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar 
                  src={review.img || defaultAvatar} 
                  sx={{ width: 56, height: 56, bgcolor: review.img ? "transparent" : colors[index % colors.length] }}
                >
                  {/* אם אין תמונה, מציגים את האות הראשונה מהשם */}
                  {/* {!review.img && review.name.charAt(0)} */}
                </Avatar>
                <Typography variant="h6" fontWeight={700} mt={2}>{review.name}</Typography>
                <Typography variant="body1" mt={1}>{review.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
