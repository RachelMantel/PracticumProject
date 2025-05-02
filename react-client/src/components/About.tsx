import { useState } from "react"
import {Box,Typography,Grid,Button,Paper,Container,Avatar,Divider,Accordion,AccordionSummary,AccordionDetails,
  Card,CardContent,} from "@mui/material"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ExpandMore,
  MusicNote,
  QueueMusic,
  Mood,
  Headphones,
  People,
  Lightbulb,
  Star,
  Speed,
  DevicesOther,
} from "@mui/icons-material"

const About = () => {
  const navigate = useNavigate()
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false)

  // Fixed the event handler by removing the explicit event type
  const handleFaqChange = (panel: string) => (_: any, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false)
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const teamMembers = [
    { name: "Alex Johnson", role: "Founder & CEO", avatar: "" },
    {
      name: "Sarah Williams",
      role: "Head of AI Development",
      avatar: "",
    },
    { name: "Michael Chen", role: "Lead Designer", avatar: "" },
    { name: "Emma Davis", role: "Music Curator", avatar: "" },
  ]

  const features = [
    {
      icon: <Star sx={{ fontSize: 40, color: "#E91E63" }} />,
      title: "AI-Powered Recommendations",
      description: "Our advanced algorithms learn your preferences and suggest music you'll love.",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "#E91E63" }} />,
      title: "Lightning Fast Performance",
      description: "Enjoy seamless streaming with minimal buffering and instant search results.",
    },
    {
      icon: <DevicesOther sx={{ fontSize: 40, color: "#E91E63" }} />,
      title: "Cross-Platform Support",
      description: "Access your music from any device, anywhere, anytime.",
    },
  ]

  const faqs = [
    {
      question: "How does AI recommend songs?",
      answer:
        "Our AI analyzes your listening habits, preferences, and even your current mood to suggest songs that match your taste. The more you use our platform, the better our recommendations become, creating a truly personalized experience.",
    },
    {
      question: "Can I create my own playlists?",
      answer:
        "You can create and customize playlists with your favorite songs, share them with friends, and even collaborate on playlists together. Our platform makes it easy to organize your music just the way you like it.",
    },
    {
      question: "Is the service free?",
      answer:
        "We offer both free and premium plans. The free plan gives you access to basic features with advertisements, while our premium plans offer ad-free listening, higher quality audio, offline downloads, and exclusive content.",
    },
    {
      question: "How do I search for music by mood?",
      answer:
        "Our unique mood-based search feature allows you to find music that matches how you're feeling. Simply select your current mood or activity from our intuitive interface, and our AI will curate the perfect playlist to enhance your experience.",
    },
    {
      question: "Can I use the service on multiple devices?",
      answer:
        "Yes! Your account can be used across multiple devices including smartphones, tablets, computers, and smart speakers. Your playlists, preferences, and listening history will sync seamlessly across all your devices.",
    },
  ]

  return (
    <Box sx={{ minHeight: "auto", pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#f9f9f9",
          pt: 8,
          pb: 10,
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Box
            component={motion.div}
            sx={{
              position: "absolute",
              top: "20%",
              left: "5%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              opacity: 0.05,
              filter: "blur(70px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.08, 0.05],
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
              bottom: "10%",
              right: "5%",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "linear-gradient(90deg, #FF5722 0%, #E91E63 100%)",
              opacity: 0.05,
              filter: "blur(70px)",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.08, 0.05, 0.08],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              About Us
            </Typography>
            <Typography variant="h5" sx={{ color: "#555", maxWidth: "800px", mx: "auto" }}>
              Learn more about our mission and vision to transform the music experience.
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <Grid container spacing={4} justifyContent="center">
              {/* About the Company */}
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeIn}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      borderRadius: "16px",
                      height: "100%",
                      background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#E91E63", mr: 2 }}>
                          <People />
                        </Avatar>
                        <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold" }}>
                          Who We Are
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />
                      <Typography variant="body1" sx={{ color: "#333", lineHeight: "1.8", fontSize: "1.1rem" }}>
                        We are a passionate team of music lovers and tech enthusiasts who believe in the power of music
                        to connect people, inspire emotions, and create unforgettable memories.
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#333", lineHeight: "1.8", fontSize: "1.1rem", mt: 2 }}>
                        Our goal is to provide a personalized, high-quality music experience for users around the world,
                        leveraging the latest in artificial intelligence to understand your unique taste and
                        preferences.
                      </Typography>
                    </Box>
                    <Box
                      component={motion.div}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      sx={{
                        position: "absolute",
                        bottom: "-50px",
                        right: "-50px",
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, rgba(233,30,99,0.05) 0%, rgba(255,87,34,0.05) 100%)",
                        zIndex: 0,
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>

              {/* Vision and Goals */}
              <Grid item xs={12} md={6}>
                <motion.div variants={fadeIn}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      borderRadius: "16px",
                      height: "100%",
                      background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#E91E63", mr: 2 }}>
                          <Lightbulb />
                        </Avatar>
                        <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold" }}>
                          Our Vision
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />
                      <Typography variant="body1" sx={{ color: "#333", lineHeight: "1.8", fontSize: "1.1rem" }}>
                        We strive to revolutionize the way people experience music by leveraging cutting-edge
                        technology, AI-driven recommendations, and a seamless interface.
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#333", lineHeight: "1.8", fontSize: "1.1rem", mt: 2 }}>
                        Our mission is to create a platform that adapts to each user's unique taste and brings music to
                        life like never before, making discovery effortless and enjoyment limitless.
                      </Typography>
                    </Box>
                    <Box
                      component={motion.div}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      sx={{
                        position: "absolute",
                        top: "-50px",
                        left: "-50px",
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, rgba(233,30,99,0.05) 0%, rgba(255,87,34,0.05) 100%)",
                        zIndex: 0,
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#E91E63",
              mb: 1,
            }}
          >
            What Makes Us Special
          </Typography>
          <Typography variant="h6" sx={{ color: "#555", maxWidth: "700px", mx: "auto" }}>
            Discover the unique features that set our music platform apart
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.2, duration: 0.5 },
                  },
                }}
              >
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#E91E63",
              mb: 1,
            }}
          >
            Meet Our Team
          </Typography>
          <Typography variant="h6" sx={{ color: "#555", maxWidth: "700px", mx: "auto" }}>
            The passionate people behind our music platform
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { delay: index * 0.1, duration: 0.4 },
                  },
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: "16px",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      border: "3px solid #E91E63",
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Explore Features Section */}
      <Box
        sx={{
          mt: 10,
          py: 8,
          background: "linear-gradient(135deg, rgba(233,30,99,0.05) 0%, rgba(255,87,34,0.05) 100%)",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#E91E63",
                mb: 3,
              }}
            >
              Explore Our Features
            </Typography>
          </motion.div>

          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<MusicNote />}
                  sx={{
                    background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px 24px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                      boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/my-songs")}
                >
                  Browse Songs
                </Button>
              </motion.div>
            </Grid>
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<QueueMusic />}
                  sx={{
                    background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px 24px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                      boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/my-playlists")}
                >
                  Discover Playlists
                </Button>
              </motion.div>
            </Grid>
            <Grid item>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<Mood />}
                  sx={{
                    background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px 24px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                      boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/mood")}
                >
                  Find Music by Mood
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          style={{ marginBottom: "2rem" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#E91E63",
              mb: 1,
              textAlign: "center",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#555",
              maxWidth: "700px",
              mx: "auto",
              textAlign: "center",
              mb: 4,
            }}
          >
            Everything you need to know about our service
          </Typography>
        </motion.div>

        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1, duration: 0.4 },
                },
              }}
            >
              <Accordion
                expanded={expandedFaq === `panel${index}`}
                onChange={handleFaqChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    background:
                      expandedFaq === `panel${index}`
                        ? "linear-gradient(90deg, rgba(233,30,99,0.05) 0%, rgba(255,87,34,0.05) 100%)"
                        : "white",
                    borderLeft: expandedFaq === `panel${index}` ? "4px solid #E91E63" : "none",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: "#555", lineHeight: "1.6" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: "16px",
              background: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
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
            <Box
              component={motion.div}
              animate={{
                rotate: 360,
                opacity: [0.03, 0.05, 0.03],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #E91E63 0%, #FF5722 100%)",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 3,
                  background: "linear-gradient(45deg, #E91E63 0%, #FF5722 100%)",
                }}
              >
                <Headphones sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ready to Start Your Musical Journey?
              </Typography>

              <Typography variant="h6" sx={{ color: "#555", mb: 4, maxWidth: "600px", mx: "auto" }}>
                Join thousands of music lovers who have already discovered the power of AI-driven music recommendations.
              </Typography>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px 30px",
                    fontSize: "1.1rem",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                      boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate("/my-songs")}
                >
                  My songs
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}

export default About