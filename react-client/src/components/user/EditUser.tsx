import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Typography, CircularProgress, Paper, IconButton, InputAdornment, Divider, Box } from "@mui/material";
import { AppDispatch, StoreType } from "../redux/store";
import { getUser, updateUser } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import { Edit, Close, Person, Email, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";

const EditUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: StoreType) => state.users);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    } else {
      const user1 = JSON.parse(localStorage.getItem("user") || "null");
      if (user1?.id) dispatch(getUser(user1.id));
    }
  }, [user, dispatch]);

  const handleUpdate = async () => {
    if (name && email && user?.id) {
      await dispatch(updateUser({ userId: user.id, name, email, password }));
    }
    navigate("/home");
    window.location.reload();
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "380px",
            textAlign: "center",
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(233,30,99,0.15)",
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
          <IconButton
            onClick={() => navigate("/home")}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#E91E63",
              transition: "all 0.3s ease",
              "&:hover": { color: "#D81B60", transform: "rotate(90deg)" },
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3, position: "relative", height: "80px" }}>
            <Box sx={{ position: "absolute", width: "100%", height: "100%" }}>
              {[Person, Email, Lock].map((Icon, i) => (
                <motion.div key={i} custom={i} animate="animate" style={{ position: "absolute", left: `${20 + i * 25}%`, top: "50%" }}>
                  <Icon sx={{ color: i === 0 ? "#E91E63" : i === 1 ? "#FF5722" : "#9C27B0", fontSize: i === 1 ? 20 : 16, opacity: 0.7 }} />
                </motion.div>
              ))}
            </Box>

            <Box sx={{ background: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)", borderRadius: "50%", p: 2, boxShadow: "0 4px 20px rgba(233,30,99,0.3)" }}>
              <Edit sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            Update Your Profile
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Keep your information up to date
          </Typography>

          {[
            { label: "Name", value: name, onChange: setName, icon: <Person /> },
            { label: "Email", value: email, onChange: setEmail, icon: <Email /> },
            { label: "New Password", value: password, onChange: setPassword, icon: <Lock />, type: "password" },
          ].map(({ label, value, onChange, icon, type }) => (
            <TextField
              key={label}
              fullWidth
              label={label}
              variant="outlined"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              type={type}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#E91E63" }, "&.Mui-focused fieldset": { borderColor: "#E91E63" } },
                "& .MuiInputLabel-root.Mui-focused": { color: "#E91E63" },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start">{icon}</InputAdornment> }}
            />
          ))}

          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Edit />}
            sx={{
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              py: 1.5,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>

          <Box sx={{ position: "relative", my: 3 }}>
            <Divider>
              <Typography variant="body2" sx={{ px: 1, color: "text.secondary", fontSize: "0.8rem" }}>ACCOUNT SETTINGS</Typography>
            </Divider>
          </Box>

          <Button
            variant="text"
            onClick={() => navigate("/home")}
            sx={{
              color: "#E91E63",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { background: "transparent", textDecoration: "underline" },
            }}
          >
            Back to Home
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default EditUser;
