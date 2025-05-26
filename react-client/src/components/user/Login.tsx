// components/Login.tsx
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { TextField, Button, Box, Typography, Paper, IconButton, CircularProgress, InputAdornment, Divider } from "@mui/material"
import { LockOpen, Close, Email, Lock, Headphones, MusicNote, QueueMusic, Album, Visibility, VisibilityOff } from "@mui/icons-material"
import { motion } from "framer-motion"
import { loginUser, googleLogin } from "../redux/AuthSlice"
import { AppDispatch, StoreType } from "../redux/store"
import GoogleLogin from "./GoogleLogin"

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: StoreType) => state.auth)

  const [formData, setFormData] = useState({ userNameOrEmail: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser(formData))
    if (loginUser.rejected.match(result) && result.error.message === "Unauthorized")
      navigate("/register")
    else if (loginUser.fulfilled.match(result))
      navigate("/home")
  }

  // 🆕 Google Login handlers
  const handleGoogleSuccess = async (token: string) => {
    const result = await dispatch(googleLogin(token))
    if (googleLogin.fulfilled.match(result)) {
      navigate("/home")
    }
  }

  const handleGoogleError = (error: string) => {
    console.error('Google login error:', error)
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper elevation={6} sx={{ p: 4, width: 380, textAlign: "center", borderRadius: "16px", position: "relative", boxShadow: "0 10px 40px rgba(233,30,99,0.15)" }}>
          <IconButton onClick={() => navigate("/home")} sx={{ position: "absolute", top: 10, right: 10, color: "#E91E63" }}>
            <Close />
          </IconButton>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3, position: "relative", height: "80px" }}>
            <Box sx={{ position: "absolute", width: "100%", height: "100%" }}>
              {[MusicNote, QueueMusic, Album].map((Icon, i) => (
                <motion.div key={i} custom={i} animate="animate" style={{ position: "absolute", left: `${20 + i * 25}%`, top: "50%" }}>
                  <Icon sx={{ color: i === 0 ? "#E91E63" : i === 1 ? "#FF5722" : "#9C27B0", fontSize: i === 1 ? 20 : 16, opacity: 0.7 }} />
                </motion.div>
              ))}
            </Box>
            <Box sx={{ background: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)", borderRadius: "50%", p: 2, boxShadow: "0 4px 20px rgba(233,30,99,0.3)" }}>
              <Headphones sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to continue your musical journey
          </Typography>

          {error && (
            <Typography color="error" fontSize="14px" mb={2} sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(244,67,54,0.1)" }}>
              {error}
            </Typography>
          )}




          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="userNameOrEmail"
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email sx={{ color: "text.secondary" }} /></InputAdornment>
              }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: "text.secondary" }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOpen />}
              disabled={loading}
              sx={{
                background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                color: "white",
                fontWeight: "bold",
                py: 1.5
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>


          {/* 🆕 Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
          
          {/* 🆕 Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            loading={loading}
          />
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Button variant="text" onClick={() => navigate("/register")} sx={{ color: "#E91E63", fontWeight: "bold" }}>
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default Login