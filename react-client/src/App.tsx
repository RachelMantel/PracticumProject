import { RouterProvider } from "react-router-dom"
import "./App.css"
import { Provider } from "react-redux"
import Store from "./components/redux/store"
import { Router } from "./Rauter"
import Footer from "./components/Footer"
import { Box } from "@mui/material"

function App() {
  return (
    <Provider store={Store}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <RouterProvider router={Router} />
        </Box>

        <Footer />
      </Box>
    </Provider>
  )
}

export default App
