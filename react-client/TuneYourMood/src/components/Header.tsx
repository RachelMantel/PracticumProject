import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import AuthButtons from "./user/AuthButtons";
import { useState } from "react";
import { StoreType } from "./redux/store";

const Header = () => {
  const navigate = useNavigate();
  const token = useSelector((state: StoreType) => state.auth.token);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // פונקציה לניווט ושינוי כפתור פעיל
  const handleNavigation = (path: string) => {
    setActiveButton(path);
    navigate(path);
  };

  // עיצוב דינמי לכפתורים
  const buttonStyle = (path: string) => ({
    color: activeButton === path ? "#E91E63" : "white",
    fontWeight: "bold",
    px: 3,
    borderRadius: "5px",
    transition: "0.3s",
    "&:hover": {
      color: "#E91E63",
      transform: "scale(1.05)",
    },
  });

  return (
    <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" height="100px" sx={{ padding: "1rem 2rem 1rem 1 rem", color: "white" }}>
      {/* אם המשתמש רשום, הצג את הכפתורים */}
      {token && (
        <Stack direction="row" spacing={4}>
          <Button sx={buttonStyle("/")} onClick={() => handleNavigation("/")}>Home</Button>
          <Button sx={buttonStyle("/about")} onClick={() => handleNavigation("/about")}>About</Button>
          <Button sx={buttonStyle("/my-songs")} onClick={() => handleNavigation("/my-songs")}>My Songs</Button>
          <Button sx={buttonStyle("/mood")} onClick={() => handleNavigation("/mood")}>Mood</Button> 
        </Stack>
      )}

      <AuthButtons />
    </Stack>
  );
};

export default Header;

