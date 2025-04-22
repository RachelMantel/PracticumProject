import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Stack, Typography, CircularProgress } from "@mui/material";
import { AppDispatch, StoreType } from "../redux/store";
import { getUser, updateUser } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";

const EditUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: StoreType) => state.users);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(""); // שדה עבור הסיסמה החדשה

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
        const user1 = JSON.parse(localStorage.getItem("user") || "null");
      if (user1.id) {
        dispatch(getUser(user1.id)); // נשלח בקשה לשרת כדי לקבל את נתוני המשתמש
      }
    }
  }, [user, dispatch]);

  const handleUpdate = async () => {
    if (name && email) {
      const userId = user?.id;
      if (userId) {
        const updatedData: { name: string, email: string, password?: string } = { name, email };
        if (password) updatedData.password = password;
        await dispatch(updateUser({ userId, ...updatedData }));
      }
    } else {
    }
    navigate("/home"); 
    window.location.reload();
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#E91E63">
        Update Your Profile
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="New Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        disabled={loading}
        sx={{ backgroundColor: "#E91E63", "&:hover": { backgroundColor: "#D81B60" } }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update"}
      </Button>
    </Stack>
  );
};

export default EditUser;
