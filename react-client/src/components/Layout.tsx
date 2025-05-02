import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: "60px", 
          bgcolor: "white",
          height: "100vh", 
        }}
      >
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: "240px", 
        }}
      >
        <Header />
        <Outlet />
      </Box>

      {/* Footer */}
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;
