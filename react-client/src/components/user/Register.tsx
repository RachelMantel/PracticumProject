import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../redux/store"
import { registerUser } from "../redux/AuthSlice"
import { useNavigate } from "react-router-dom"
import {
  TextField, Button, Box, Typography, Paper, IconButton, CircularProgress, Divider, InputAdornment
} from "@mui/material"
import { Close, Email, Lock, Headphones, MusicNote, QueueMusic, Album, Visibility, VisibilityOff } from "@mui/icons-material"
import { motion } from "framer-motion"

const Register = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading } = useSelector((state: StoreType) => state.auth)

  const [formData, setFormData] = useState({ userNameOrEmail: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { userNameOrEmail, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setEmailError("Passwords do not match!")
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(userNameOrEmail)) {
      setEmailError("Please enter a valid email address.")
      return
    }

    setEmailError("") // Clear error if email is valid

    const result = await dispatch(registerUser({ name: "", email: userNameOrEmail, password }))
    if (registerUser.rejected.match(result)) {
      setEmailError("An error occurred. Please try again.")
    } else if (registerUser.fulfilled.match(result)) {
      navigate("/home")
    }
  }

  const noteVariants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      opacity: [0.2, 1, 0.2],
      transition: {
        delay: i * 0.2,
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    }),
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper elevation={6} sx={{
          p: 4, width: "380px", textAlign: "center", borderRadius: "16px", position: "relative", overflow: "hidden",
          boxShadow: "0 10px 40px rgba(233,30,99,0.15)", "&::before": {
            content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "4px",
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)"
          }
        }}>
          <IconButton onClick={() => navigate("/home")} sx={{
            position: "absolute", top: 10, right: 10, color: "#E91E63", transition: "all 0.3s ease", "&:hover": {
              color: "#D81B60", transform: "rotate(90deg)"
            }
          }}>
            <Close />
          </IconButton>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3, position: "relative", height: "80px" }}>
            <Box sx={{ position: "absolute", width: "100%", height: "100%" }}>
              {[MusicNote, QueueMusic, Album].map((Icon, i) => (
                <motion.div key={i} custom={i} variants={noteVariants} animate="animate" style={{ position: "absolute", left: `${20 + i * 25}%`, top: "50%" }}>
                  <Icon sx={{ color: i === 0 ? "#E91E63" : i === 1 ? "#FF5722" : "#9C27B0", fontSize: i === 1 ? 20 : 16, opacity: 0.7 }} />
                </motion.div>
              ))}
            </Box>
            <Box sx={{ background: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)", borderRadius: "50%", p: 2, boxShadow: "0 4px 20px rgba(233,30,99,0.3)" }}>
              <Headphones sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            Sign Up
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Create an account to continue your musical journey
          </Typography>

          {emailError && (
            <Typography color="error" fontSize="14px" mb={2} sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(244,67,54,0.1)" }}>
              {emailError}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" variant="outlined" name="userNameOrEmail" onChange={handleChange} required sx={{ mb: 2 }} InputProps={{
              startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.secondary" }} /></InputAdornment>
            }} />
            <TextField fullWidth label="Password" variant="outlined" type={showPassword ? "text" : "password"} name="password" onChange={handleChange} required sx={{ mb: 3 }} InputProps={{
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.secondary" }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }} />
            <TextField fullWidth label="Confirm Password" variant="outlined" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" onChange={handleChange} required sx={{ mb: 3 }} InputProps={{
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.secondary" }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }} />
            <Button fullWidth type="submit" variant="contained" sx={{
              py: 1.5, borderRadius: 2, background: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)", "&:hover": {
                background: "linear-gradient(135deg, #FF5722 0%, #E91E63 100%)"
              }
            }}>
              {loading ? <CircularProgress color="inherit" size={24} /> : "Register"}
            </Button>
          </form>

          <Divider sx={{ my: 3, borderColor: "#E91E63" }} />

          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <span style={{ color: "#E91E63", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/login")}>
              Login
            </span>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default Register
