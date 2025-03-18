import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./redux/store";
import { loginUser } from "./redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, IconButton, CircularProgress } from "@mui/material";
import { LockOpen, Close } from "@mui/icons-material";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: StoreType) => state.auth);
  
  const [formData, setFormData] = useState({ userNameOrEmail: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    
    if (loginUser.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={6} sx={{ p: 4, width: "350px", textAlign: "center", borderRadius: "8px", position: "relative" }}>
        
        <IconButton
          onClick={() => navigate("/home")}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#E91E63",
            "&:hover": { color: "#D81B60" },
          }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" fontWeight="bold" color="#E91E63" mb={2}>
          Login
        </Typography>

        {error && (
          <Typography color="error" fontSize="14px" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username or Email"
            variant="outlined"
            name="userNameOrEmail"
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOpen />}
            disabled={loading}
            sx={{
              background: "black",
              color: "#E91E63",
              fontWeight: "bold",
              borderRadius: "8px",
              py: 1.5,
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;

