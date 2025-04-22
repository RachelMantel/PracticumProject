import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, StoreType } from "../redux/store";
import { logout } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Avatar, Menu, MenuItem, IconButton, Typography, Divider } from "@mui/material";
import { Login, Logout, PersonAdd, AccountCircle, Edit } from "@mui/icons-material";
import { useState } from "react";

const AuthButtons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector((state: StoreType) => state.auth.token);
  const user = useSelector((state: StoreType) => state.auth.user);
  const userName = user ? user.name : "Guest";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate("/"); 
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/edit-user"); // מעבר לדף הפרופיל
    setAnchorEl(null);
  };

  const buttonStyle = {
    color: "white",
    fontWeight: "bold",
    px: 3,
    borderRadius: "5px",
    "&:hover": {
      color: "#E91E63",
      transform: "scale(1.05)",
    },
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {token ? (
        <>
          <IconButton onClick={handleClick}>
            <Avatar sx={{ bgcolor: "#E91E63", color: "white" }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ mt: 1 }}>
            <MenuItem disabled>
              <AccountCircle sx={{ mr: 1, color: "#E91E63" }} />
              <Typography variant="body1" fontWeight="bold">{userName}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfile} sx={{ fontWeight: "bold" }}>
              <Edit sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "#E91E63", fontWeight: "bold" }}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button sx={buttonStyle} startIcon={<Login />} onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button sx={buttonStyle} startIcon={<PersonAdd />} onClick={() => navigate("/register")}>
            Register
          </Button>
        </>
      )}
    </Stack>
  );
};

export default AuthButtons;
