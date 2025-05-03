import { Box } from "@mui/material"
import Header from "./Header"
import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Load the sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setSidebarCollapsed(savedState === "true")
    }
  }, [])

  // Function to toggle sidebar that can be passed to Header
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? "45px" : "130px"

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: sidebarWidth,
          bgcolor: "white",
          height: "100vh",
          transition: "width 0.3s ease",
        }}
      ></Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
