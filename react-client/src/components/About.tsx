import { Box, Typography, Grid, Button, Paper, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "auto", padding: "4rem 2rem", pb: "30px" }}>
      
      {/* כותרת עמוד */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#E91E63" }}>
          About Us
        </Typography>
        <Typography variant="h5" sx={{ color: "#555", marginTop: "1rem" }}>
          Learn more about our mission and vision to transform the music experience.
        </Typography>
      </motion.div>

      {/* תוכן עמוד */}
      <Grid container spacing={4} justifyContent="center">
        {/* אודות החברה */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: "2rem", boxShadow: 3, borderRadius: "8px", backgroundColor: "#fff" }}>
            <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold", marginBottom: "1rem" }}>
              Who We Are
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", lineHeight: "1.6" }}>
              We are a passionate team of music lovers and tech enthusiasts who believe in
              the power of music to connect people, inspire emotions, and create unforgettable memories.
              Our goal is to provide a personalized, high-quality music experience for users around the world.
            </Typography>
          </Paper>
        </Grid>

        {/* המטרות והחזון */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: "2rem", boxShadow: 3, borderRadius: "8px", backgroundColor: "#fff" }}>
            <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold", marginBottom: "1rem" }}>
              Our Vision
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", lineHeight: "1.6" }}>
              We strive to revolutionize the way people experience music by leveraging cutting-edge technology,
              AI-driven recommendations, and a seamless interface. Our mission is to create a platform that
              adapts to each user’s unique taste and brings music to life like never before.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* קישורים לשירותים שלנו */}
      <Box sx={{ textAlign: "center", marginTop: "4rem" }}>
        <Typography variant="h5" sx={{ color: "#E91E63", marginBottom: "1rem" }}>
          Explore Our Features
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              sx={{ bgcolor: "#E91E63", "&:hover": { bgcolor: "#d81b60" }, padding: "1rem 2rem", fontSize: "1rem" }}
              onClick={() => navigate("/my-songs")}
            >
              Browse Songs
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ bgcolor: "#E91E63", "&:hover": { bgcolor: "#d81b60" }, padding: "1rem 2rem", fontSize: "1rem" }}
              onClick={() => navigate("/my-playlists")}
            >
              Discover Playlists
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ bgcolor: "#E91E63", "&:hover": { bgcolor: "#d81b60" }, padding: "1rem 2rem", fontSize: "1rem" }}
              onClick={() => navigate("/mood")}
            >
              Find Music by Mood
            </Button>
          </Grid>
        </Grid>
      </Box>
            {/* שאלות נפוצות */}
            <Container maxWidth="md" sx={{ mt: 10 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Frequently Asked Questions
        </Typography>
        {[
          { question: "How does AI recommend songs?", answer: "Our AI analyzes  suggests songs that match your mood and preferences." },
          { question: "Can I create my own playlists?", answer: "Absolutely! You can create and customize playlists with your favorite songs." },
          { question: "Is the service free?", answer: "We offer both free and premium plans with additional features." }
        ].map((faq, index) => (
          <Box key={index} sx={{ mt: 3, p: 3, bgcolor: "#ffffff", borderRadius: 3, textAlign: "left", boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={700}>{faq.question}</Typography>
            <Typography variant="body1" mt={1}>{faq.answer}</Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
};

export default About;

