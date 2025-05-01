"use client"

import { Box, Typography, Paper } from "@mui/material"
import { motion } from "framer-motion"

interface MoodResultProps {
  mood: string
  compact?: boolean
}

const MoodResult = ({ mood, compact = false }: MoodResultProps) => {
  const moodData: Record<
    string,
    {
      emoji: string
      description: string
      color: string
      gradient: string
      particleColor: string
      animation: string
    }
  > = {
    happy: {
      emoji: "😊",
      description: "You're feeling happy and upbeat! Let's find some cheerful tunes to match your vibe.",
      color: "#FFD700", // Gold
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      particleColor: "#FFD700",
      animation: "bounce",
    },
    sad: {
      emoji: "😢",
      description: "You're feeling a bit down. Music can be a great companion during emotional times.",
      color: "#4169E1", // Royal Blue
      gradient: "linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)",
      particleColor: "#4169E1",
      animation: "float",
    },
    excited: {
      emoji: "🤩",
      description: "You're excited and full of energy! Let's find something that matches your enthusiasm.",
      color: "#FF4500", // Orange Red
      gradient: "linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)",
      particleColor: "#FF4500",
      animation: "pulse",
    },
    angry: {
      emoji: "😠",
      description: "You're feeling angry. Some music might help you process those intense emotions.",
      color: "#B22222", // Fire Brick
      gradient: "linear-gradient(135deg, #B22222 0%, #8B0000 100%)",
      particleColor: "#B22222",
      animation: "shake",
    },
    relaxed: {
      emoji: "😌",
      description: "You're in a relaxed state of mind. Let's find something soothing to maintain that calm.",
      color: "#20B2AA", // Light Sea Green
      gradient: "linear-gradient(135deg, #20B2AA 0%, #5F9EA0 100%)",
      particleColor: "#20B2AA",
      animation: "wave",
    },
    hopeful: {
      emoji: "🌟",
      description: "You're feeling hopeful! Let's find some inspiring music to fuel your optimism.",
      color: "#9370DB", // Medium Purple
      gradient: "linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%)",
      particleColor: "#9370DB",
      animation: "sparkle",
    },
    grateful: {
      emoji: "🙏",
      description: "You're feeling grateful. Let's find music that celebrates life's blessings.",
      color: "#3CB371", // Medium Sea Green
      gradient: "linear-gradient(135deg, #3CB371 0%, #2E8B57 100%)",
      particleColor: "#3CB371",
      animation: "glow",
    },
    nervous: {
      emoji: "😬",
      description: "You're feeling nervous. Some calming music might help ease your anxiety.",
      color: "#6A5ACD", // Slate Blue
      gradient: "linear-gradient(135deg, #6A5ACD 0%, #483D8B 100%)",
      particleColor: "#6A5ACD",
      animation: "vibrate",
    },
  }

  // Default values if mood is not in our mapping
  const defaultMood = {
    emoji: "😐",
    description: "I've analyzed your mood. Here's a song that might resonate with how you're feeling.",
    color: "#E91E63", // Default to primary color
    gradient: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)",
    particleColor: "#E91E63",
    animation: "pulse",
  }

  const { emoji, description, color, gradient, animation } = moodData[mood.toLowerCase()] || defaultMood

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const emojiVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8,
      },
    },
  }

  // Animation for the emoji based on the mood
  const getEmojiAnimation = () => {
    switch (animation) {
      case "bounce":
        return {
          y: [0, -15, 0],
          transition: {
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "float":
        return {
          y: [0, -8, 0],
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "pulse":
        return {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "shake":
        return {
          x: [0, -5, 5, -5, 5, 0],
          transition: {
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1.5,
          },
        }
      case "wave":
        return {
          rotate: [0, 5, 0, -5, 0],
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "sparkle":
        return {
          scale: [1, 1.15, 1],
          filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "glow":
        return {
          boxShadow: [
            "0 0 5px rgba(255,255,255,0.5)",
            "0 0 20px rgba(255,255,255,0.8)",
            "0 0 5px rgba(255,255,255,0.5)",
          ],
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "vibrate":
        return {
          x: [0, -2, 2, -2, 2, 0],
          transition: {
            duration: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.5,
          },
        }
      default:
        return {
          scale: [1, 1.1, 1],
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
    }
  }

  // Compact version for side-by-side display
  if (compact) {
    return (
      <Paper
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          p: 3,
          borderRadius: "20px",
          background: `${gradient}10`,
          border: `1px solid ${color}30`,
          boxShadow: `0 8px 25px ${color}20`,
          overflow: "hidden",
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background: `${gradient}`,
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Emoji with animation */}
          <Box
            component={motion.div}
            variants={emojiVariants}
            animate={getEmojiAnimation()}
            sx={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
              boxShadow: `0 8px 25px ${color}30`,
              mb: 2,
            }}
          >
            <Typography variant="h2" sx={{ fontSize: "2.5rem" }}>
              {emoji}
            </Typography>
          </Box>

          {/* Mood title */}
          <Box component={motion.div} variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color,
                textTransform: "capitalize",
                mb: 1,
                textShadow: `0 2px 8px ${color}40`,
              }}
            >
              {mood}
            </Typography>
          </Box>

          {/* Short description - only first sentence */}
          <Box component={motion.div} variants={itemVariants}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                maxWidth: "100%",
                mx: "auto",
              }}
            >
              {description.split(".")[0] + "."}
            </Typography>
          </Box>
        </Box>
      </Paper>
    )
  }

  // Full version (original)
  return (
    <Paper
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        p: 4,
        borderRadius: "24px",
        background: `${gradient}10`,
        border: `1px solid ${color}30`,
        boxShadow: `0 10px 30px ${color}20`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: `${gradient}`,
          zIndex: 0,
        }}
      />

      {/* Circular glow behind emoji */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Emoji with animation */}
        <Box
          component={motion.div}
          variants={emojiVariants}
          animate={getEmojiAnimation()}
          sx={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
            boxShadow: `0 8px 32px ${color}30`,
            mb: 3,
          }}
        >
          <Typography variant="h1" sx={{ fontSize: "4rem" }}>
            {emoji}
          </Typography>
        </Box>

        {/* Mood title */}
        <Box component={motion.div} variants={itemVariants}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color,
              textTransform: "capitalize",
              mb: 2,
              textShadow: `0 2px 10px ${color}40`,
            }}
          >
            {mood}
          </Typography>
        </Box>

        {/* Description */}
        <Box component={motion.div} variants={itemVariants}>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: "500px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Decorative elements */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />
      </Box>
    </Paper>
  )
}

export default MoodResult
