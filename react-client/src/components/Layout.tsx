import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import Header from "./Header";


const Layout = () => {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "#E91E63", fontWeight: "bold" }}>
            Tune your mood!
          </Typography>
          <Header/>

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
