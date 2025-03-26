import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";  // אם לא התקנת את framer-motion, תוודא שיש לך את זה עם npm install framer-motion

const About = () => {
  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "4rem 2rem" }}>
      
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

      {/* כפתור "הצטרף אלינו" */}
      <Box sx={{ textAlign: "center", marginTop: "4rem" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#E91E63", 
            "&:hover": { bgcolor: "#d81b60" }, 
            padding: "1rem 2rem", 
            fontSize: "1rem"
          }}
        >
          Join Us
        </Button>
      </Box>
    </Box>
  );
};

export default About;
