import { Outlet } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";

const Layout = () => {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "#E91E63", fontWeight: "bold" }}>
            Tune your mood!
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>

    </Box>
  );
};

export default Layout;
