"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, Typography, Container, Grid, Avatar, Paper, Stack } from "@mui/material"
import {MusicNote,QueueMusic,PlayCircle,Star,ChevronRight,Headphones,LibraryMusic,AutoAwesome as Sparkles
,Person as PersonIcon,Login,} from "@mui/icons-material"
import { motion } from "framer-motion"

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const testimonials = [
    {
      name: "John Doe",
      text: "This app changed how I listen to music!",
      image: "",
      color: "#E91E63",
    },
    {
      name: "Sarah Lee",
      text: "The AI recommendations are spot on!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      color: "#FF5722",
    },
    {
      name: "Mike Brown",
      text: "Love the huge variety of songs!",
      image: "",
      color: "#9C27B0",
    },
    {
      name: "Anna Smith",
      text: "The mood-based search is a game-changer!",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      color: "#E91E63",
    },
    {
      name: "James Wilson",
      text: "Such a smooth and enjoyable experience.",
      image: "",
      color: "#FF5722",
    },
  ]

  const features = [
    {
      icon: <Sparkles sx={{ fontSize: 40 }} />,
      title: "AI-Powered Recommendations",
      description: "Get personalized music suggestions based on your taste and mood",
    },
    {
      icon: <LibraryMusic sx={{ fontSize: 40 }} />,
      title: "Huge Song Library",
      description: "Access millions of tracks across all genres and eras",
    },
    {
      icon: <QueueMusic sx={{ fontSize: 40 }} />,
      title: "Custom Playlists",
      description: "Create and share your perfect playlists for any occasion",
    },
  ]

  const defaultAvatar = "https://via.placeholder.com/56?text=No+Image"
  const colors = ["#E91E63", "#FF5722", "#9C27B0", "#3F51B5"]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
        color: "#121212",
        overflow: "hidden",
      }}
    >
      <Box
        component={motion.div}
        sx={{
          pt: { xs: 8, md: 12 },
          pb: 6,
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Elements */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Box
            component={motion.div}
            sx={{
              position: "absolute",
              top: "80px",
              left: "40px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              opacity: 0.1,
              filter: "blur(70px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <Box
            component={motion.div}
            sx={{
              position: "absolute",
              bottom: "80px",
              right: "40px",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background: "linear-gradient(90deg, #FF5722 0%, #E91E63 100%)",
              opacity: 0.1,
              filter: "blur(70px)",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.1, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Hero Content */}
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                <Box component={motion.div} variants={itemVariants}>
                  <Typography
                    variant="h2"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                      background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                    }}
                  >
                    AI Music Player
                  </Typography>
                </Box>

                <Box component={motion.div} variants={itemVariants}>
                  <Typography
                    variant="h5"
                    sx={{
                      opacity: 0.8,
                      mb: 4,
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    Discover, Play, and Personalize Your Music Experience
                  </Typography>
                </Box>

                <Box
                  component={motion.div}
                  variants={itemVariants}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  {token ? (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<LibraryMusic />}
                        onClick={() => navigate("/my-songs")}
                        sx={{
                          background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                          color: "white",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                            boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Explore Library
                      </Button>
                    
                      <Button
                        variant="contained"
                        startIcon={<MusicNote />}
                        onClick={() => navigate("/mood")}
                        sx={{
                          background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                          color: "white",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                            boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Search By Mood
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<Login />}
                        onClick={() => navigate("/login")}
                        sx={{
                          background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                          color: "white",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                            boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate("/register")}
                        sx={{
                          background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                          color: "white",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                            boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Hero Image */}
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component={motion.div}
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                sx={{ width: "100%", maxWidth: "400px" }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    component={motion.div}
                    sx={{
                      position: "absolute",
                      top: "-24px",
                      left: "-24px",
                      color: "#E91E63",
                      zIndex: 2,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      rotate: [0, 10, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <MusicNote sx={{ fontSize: 48 }} />
                  </Box>

                  <Box
                    component={motion.div}
                    sx={{
                      position: "absolute",
                      bottom: "-16px",
                      right: "-16px",
                      color: "#FF5722",
                      zIndex: 2,
                    }}
                    animate={{
                      y: [5, -5, 5],
                      rotate: [0, -10, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <QueueMusic sx={{ fontSize: 40 }} />
                  </Box>

                  <Paper
                    elevation={10}
                    sx={{
                      borderRadius: "16px",
                      p: 4,
                      position: "relative",
                      overflow: "hidden",
                      background: "white",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, rgba(233,30,99,0.1) 0%, rgba(255,87,34,0.1) 100%)",
                        zIndex: 0,
                      }}
                    />

                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Box
                          component={motion.div}
                          variants={pulseVariants}
                          initial="initial"
                          animate="animate"
                          sx={{
                            background: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)",
                            p: 2,
                            borderRadius: "50%",
                            boxShadow: "0 4px 20px rgba(233,30,99,0.3)",
                          }}
                        >
                          <Headphones sx={{ fontSize: 64, color: "white" }} />
                        </Box>
                      </Box>

                      <Stack spacing={2}>
                        <Box
                          sx={{
                            height: "32px",
                            background: "linear-gradient(90deg, rgba(233,30,99,0.2) 0%, rgba(255,87,34,0.2) 100%)",
                            borderRadius: "16px",
                          }}
                        />
                        <Box
                          sx={{
                            height: "32px",
                            width: "83%",
                            mx: "auto",
                            background: "linear-gradient(90deg, rgba(233,30,99,0.15) 0%, rgba(255,87,34,0.15) 100%)",
                            borderRadius: "16px",
                          }}
                        />
                        <Box
                          sx={{
                            height: "32px",
                            width: "66%",
                            mx: "auto",
                            background: "linear-gradient(90deg, rgba(233,30,99,0.1) 0%, rgba(255,87,34,0.1) 100%)",
                            borderRadius: "16px",
                          }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                          <Box
                            component={motion.div}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            sx={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              boxShadow: "0 4px 15px rgba(233,30,99,0.3)",
                              cursor: "pointer",
                            }}
                          >
                            <PlayCircle sx={{ fontSize: 32 }} />
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Why Choose AI Music Player?
            </Typography>
            <Box
              sx={{
                width: "100px",
                height: "4px",
                background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                mx: "auto",
                borderRadius: "2px",
              }}
            />
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box sx={{ mb: 2, color: "#E91E63" }}>{feature.icon}</Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: "#F5F5F5" }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              What Our Users Say
            </Typography>
            <Box
              sx={{
                width: "100px",
                height: "4px",
                background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                mx: "auto",
                borderRadius: "2px",
              }}
            />
          </Box>

          {/* First row of testimonials */}
          <Grid container spacing={3}>
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Avatar
                      src={testimonial.image || defaultAvatar}
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        bgcolor: testimonial.image ? "transparent" : colors[index % colors.length],
                        border: `2px solid ${testimonial.color}`,
                      }}
                    >
                      {!testimonial.image && testimonial.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic", mb: 2 }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: "flex", color: "#FF5722" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fontSize="small" />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Second row of testimonials */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {testimonials.slice(3, 5).map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index + 3}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Avatar
                      src={testimonial.image || defaultAvatar}
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        bgcolor: testimonial.image ? "transparent" : colors[(index + 3) % colors.length],
                        border: `2px solid ${testimonial.color}`,
                      }}
                    >
                      {!testimonial.image && testimonial.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic", mb: 2 }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: "flex", color: "#FF5722" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fontSize="small" />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(233,30,99,0.1) 0%, rgba(255,87,34,0.1) 100%)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={6}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: "24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                },
              }}
            >
              <Typography
                variant="h3"
                fontWeight={700}
                gutterBottom
                sx={{
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                }}
              >
                Ready to Transform Your Music Experience?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: "700px", mx: "auto" }}>
                Join thousands of music lovers who have already discovered the power of AI-driven music recommendations
                and personalized playlists.
              </Typography>
              <Box component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ChevronRight />}
                  onClick={() => navigate(token ? "/my-songs" : "/register")}
                  sx={{
                    background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                      boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {token ? "Explore Now" : "Get Started Free"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
