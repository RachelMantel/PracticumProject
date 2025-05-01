import { useState } from "react"
import { Box, Typography, Card, CardContent, IconButton, Tooltip, Divider, Avatar } from "@mui/material"
import { motion } from "framer-motion"
import {PlayArrow,Favorite,FavoriteBorder,Add,Share,Headphones} from "@mui/icons-material"

interface SongRecommendationProps {
  song: any
  onPlay: () => void
}

const SongRecommendation = ({ song, onPlay }: SongRecommendationProps) => {
  const [liked, setLiked] = useState(false)
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }



  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Box component={motion.div} variants={itemVariants}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 4,
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              borderRadius: "2px",
            },
          }}
        >
          Perfect Match For Your Mood
        </Typography>
      </Box>

      <Card
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          borderRadius: "24px",
          overflow: "visible",
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          mx: "auto",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: "linear-gradient(180deg, rgba(233,30,99,0.03) 0%, rgba(255,87,34,0.03) 100%)",
            borderRadius: "24px",
            zIndex: 0,
          },
        }}
      >
        <CardContent
          sx={{
            p: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box component={motion.div} variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 0.5,
              }}
            >
              {song.songName}
            </Typography>
          </Box>

          <Box component={motion.div} variants={itemVariants}>
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                mb: 2,
                fontStyle: "italic",
              }}
            >
              {song.artist}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                  width: 36,
                  height: 36,
                  mr: 1,
                }}
              >
                <Headphones sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Added to
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  Your Mood Mix
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Add to playlist">
                <IconButton
                  size="small"
                  sx={{
                    color: "#555",
                    "&:hover": {
                      color: "#E91E63",
                      background: "rgba(233, 30, 99, 0.1)",
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
              <Tooltip title={liked ? "Remove from favorites" : "Add to favorites"}>
                <IconButton
                  size="small"
                  onClick={() => setLiked(!liked)}
                  sx={{
                    color: liked ? "#E91E63" : "#555",
                    "&:hover": {
                      color: "#E91E63",
                      background: "rgba(233, 30, 99, 0.1)",
                    },
                  }}
                >
                  {liked ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  size="small"
                  sx={{
                    color: "#555",
                    "&:hover": {
                      color: "#E91E63",
                      background: "rgba(233, 30, 99, 0.1)",
                    },
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onPlay}
                sx={{
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px 24px",
                  borderRadius: "50px",
                  boxShadow: "0 8px 20px rgba(233, 30, 99, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                    boxShadow: "0 10px 25px rgba(233, 30, 99, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
                startIcon={<PlayArrow />}
              >
                Play Now
              </Button>
            </motion.div>
          </Box>
        </CardContent>

        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          sx={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255,87,34,0.1) 0%, rgba(233,30,99,0.1) 100%)",
            zIndex: 0,
          }}
        />
      </Card>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          height: "40px",
          gap: "3px",
          mt: 3,
        }}
      >
        {[...Array(16)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              height: [
                `${Math.floor(Math.random() * 15) + 5}px`,
                `${Math.floor(Math.random() * 30) + 10}px`,
                `${Math.floor(Math.random() * 15) + 5}px`,
              ],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.05,
            }}
            sx={{
              width: "3px",
              background: `linear-gradient(to top, #E91E63${i % 3 === 0 ? "FF" : i % 3 === 1 ? "CC" : "99"}, #FF5722${
                i % 3 === 0 ? "99" : i % 3 === 1 ? "CC" : "FF"
              })`,
              borderRadius: "3px",
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

const Button = ({ children, sx, onClick, startIcon }: any) => {
  return (
    <motion.button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        border: "none",
        cursor: "pointer",
        ...sx,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {startIcon}
      {children}
    </motion.button>
  )
}

export default SongRecommendation
