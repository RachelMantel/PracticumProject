
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Box, Drawer, Stack, Typography, IconButton, Button, Tooltip, Badge } from "@mui/material"
import { useSelector } from "react-redux"
import type { StoreType } from "./redux/store"
import AuthButtons from "./user/AuthButtons"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import InfoRoundedIcon from "@mui/icons-material/InfoRounded"
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded"
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded"
import MoodRoundedIcon from "@mui/icons-material/MoodRounded"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import LockIcon from "@mui/icons-material/Lock"
import { motion } from "framer-motion"

interface HeaderProps {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const Header = ({ sidebarCollapsed, toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector((state: StoreType) => state.auth.token)
  const [activeButton, setActiveButton] = useState<string>(location.pathname)

  useEffect(() => {
    setActiveButton(location.pathname)
  }, [location.pathname])

  const handleNavigation = (path: string) => {
    if (!token && path !== "/" && path !== "/about") {
      navigate("/login")
    } else {
      setActiveButton(path)
      navigate(path)
    }
  }

  const menuItems = [
    { path: "/", label: "Home", icon: <HomeRoundedIcon />, requiresAuth: false },
    { path: "/about", label: "About", icon: <InfoRoundedIcon />, requiresAuth: false },
    { path: "/my-playlists", label: "My Playlists", icon: <QueueMusicRoundedIcon />, requiresAuth: true },
    { path: "/my-songs", label: "My Songs", icon: <MusicNoteRoundedIcon />, requiresAuth: true },
    { path: "/mood", label: "Mood", icon: <MoodRoundedIcon />, requiresAuth: true },
  ]

  const sidebarWidth = sidebarCollapsed ? 80 : 280
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#333",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        width: sidebarWidth,
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: sidebarCollapsed ? 3 : 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          height: "22px",
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "#E91E63",
            mr: 1,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>

        {!sidebarCollapsed ? (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              fontSize: "1.2rem",
            }}
          >
            TUNEYOURMOOD
          </Typography>
        ) : (
          <Typography></Typography>
        )}
      </Box>

      <Stack
        sx={{
          flexGrow: 1,
          mt: 4,
          px: sidebarCollapsed ? 2 : 2,
          overflowY: "auto",
        }}
        spacing={1}
      >
        {menuItems.map((item) => {
          const needsAuth = item.requiresAuth && !token

          return (
            <Tooltip key={item.path} title={needsAuth ? "Login required" : ""} placement="right" arrow>
              <div>
                <Button
                  onClick={() => handleNavigation(item.path)}
                  startIcon={
                    !sidebarCollapsed &&
                    (needsAuth ? (
                      <Badge
                        badgeContent={<LockIcon sx={{ fontSize: 10 }} />}
                        color="error"
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    ))
                  }
                  sx={{
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                    py: 1.5,
                    px: sidebarCollapsed ? 1 : 2,
                    borderRadius: "12px",
                    color: activeButton === item.path ? "#E91E63" : needsAuth ? "rgba(26, 32, 44, 0.5)" : "#1A202C",
                    backgroundColor: activeButton === item.path ? "rgba(233, 30, 99, 0.1)" : "transparent",
                    fontWeight: activeButton === item.path ? 600 : 500,
                    "&:hover": {
                      backgroundColor: "rgba(233, 30, 99, 0.2)",
                      transform: sidebarCollapsed ? "scale(1.1)" : "translateX(5px)",
                    },
                    transition: "all 0.3s ease",
                    textAlign: "left",
                    textTransform: "none",
                    fontSize: "1rem",
                    letterSpacing: "0.3px",
                    minWidth: 0,
                    width: "100%",
                    opacity: needsAuth ? 0.7 : 1,
                  }}
                >
                  {sidebarCollapsed ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {needsAuth ? (
                        <Badge
                          badgeContent={<LockIcon sx={{ fontSize: 8 }} />}
                          color="error"
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </Box>
                  ) : (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      {item.label}
                    </motion.span>
                  )}
                </Button>
              </div>
            </Tooltip>
          )
        })}
      </Stack>
    </Box>
  )

  const desktopDrawer = (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: sidebarWidth,
          border: "none",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
          color: "#333",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  )

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          backgroundColor: "#fff",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          cursor: "pointer", // Add cursor pointer to indicate it's clickable
        }}
        onClick={toggleSidebar} // Add click handler to toggle sidebar
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AuthButtons />
        </Box>
      </Box>
      {desktopDrawer}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          pt: "70px",
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      ></Box>
    </>
  )
}

export default Header
