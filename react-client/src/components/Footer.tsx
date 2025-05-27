"use client"
import { useState, useEffect } from "react"
import { Box, Container, Typography, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material"
import { GitHub, LinkedIn, Twitter, Instagram, KeyboardArrowUp, Favorite, Headphones } from "@mui/icons-material"

const Footer = () => {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsScrollToTopVisible(true)
      } else {
        setIsScrollToTopVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  useEffect(() => {
    const detectSidebar = () => {
      const possibleSelectors = [
        ".MuiDrawer-root .MuiPaper-root",
        '[role="navigation"]',
        ".sidebar",
        ".navigation",
        ".nav-sidebar",
        ".side-nav",
        "nav.sidebar",
        ".drawer",
        ".menu-sidebar",
      ]

      let detectedWidth = 0
      let isOpen = false

      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector)
        if (element) {
          const rect = element.getBoundingClientRect()
          const computedStyle = window.getComputedStyle(element)

          if (
            rect.width > 0 &&
            computedStyle.display !== "none" &&
            computedStyle.visibility !== "hidden" &&
            rect.left < window.innerWidth
          ) {
            detectedWidth = Math.max(detectedWidth, rect.width)
            isOpen = true
          }
        }
      }

      const allElements = document.querySelectorAll("*")
      allElements.forEach((el) => {
        const style = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()

        if (
          (style.position === "fixed" || style.position === "absolute") &&
          rect.left <= 10 &&
          rect.width > 200 &&
          rect.height > window.innerHeight * 0.5 &&
          rect.top <= 100
        ) {
          detectedWidth = Math.max(detectedWidth, rect.width)
          isOpen = true
        }
      })

      if (!isMobile) {
        setSidebarWidth(detectedWidth)
        setIsSidebarOpen(isOpen)
      } else {
        setSidebarWidth(0)
        setIsSidebarOpen(false)
      }
    }

    detectSidebar()

    const observer = new MutationObserver(() => {
      setTimeout(detectSidebar, 100)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "aria-hidden", "data-state"],
    })

    const handleResize = () => {
      setTimeout(detectSidebar, 100)
    }
    window.addEventListener("resize", handleResize)

    const handleRouteChange = () => {
      setTimeout(detectSidebar, 200)
    }
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [isMobile])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const socialLinks = [
    { name: "GitHub", icon: <GitHub />, href: "https://github.com", color: "#333" },
    { name: "LinkedIn", icon: <LinkedIn />, href: "https://linkedin.com", color: "#0077B5" },
    { name: "Twitter", icon: <Twitter />, href: "https://twitter.com", color: "#1DA1F2" },
    { name: "Instagram", icon: <Instagram />, href: "https://instagram.com", color: "#E4405F" },
  ]

  const footerStyles = {
    position: "relative" as const,
    zIndex: 1,
    marginLeft: isMobile ? 0 : isSidebarOpen ? `${sidebarWidth}px` : 0,
    width: isMobile ? "100%" : isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : "100%",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "linear-gradient(90deg, #FFFFFF 0%, #F8F9FA 100%)",
    borderTop: "1px solid #E5E7EB",
    color: "#374151",
    mt: 2, // Reduced from 8
    overflow: "hidden",
  }

  return (
    <>
      {/* Compact Footer */}
      <Box component="footer" sx={footerStyles}>
        {/* Top accent line */}
        <Box
          sx={{
            height: "2px", // Reduced from 4px
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
          }}
        />

        {/* Single row footer content */}
        <Container
          maxWidth={false}
          sx={{
            maxWidth: isSidebarOpen && !isMobile ? `calc(1200px - ${sidebarWidth * 0.5}px)` : "1200px",
            py: 2, // Reduced from 6
            px: { xs: 2, sm: 3, md: 4 },
            mx: "auto",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            {/* Brand */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                  p: 0.8, // Reduced padding
                  borderRadius: "8px", // Smaller radius
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Headphones sx={{ fontSize: 20, color: "white" }} /> {/* Smaller icon */}
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1rem", md: "1.1rem" }, // Smaller font
                }}
              >
                TuneYourMood
              </Typography>
            </Box>

            {/* Quick Links */}
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
              <Typography
                component="a"
                href="#features"
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "#E91E63",
                  },
                }}
              >
                Features
              </Typography>
              <Typography
                component="a"
                href="#about"
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "#E91E63",
                  },
                }}
              >
                About
              </Typography>
              <Typography
                component="a"
                href="#contact"
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "#E91E63",
                  },
                }}
              >
                Contact
              </Typography>
            </Stack>

            {/* Right section */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* Social Links */}
              <Stack direction="row" spacing={0.5}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: "text.secondary",
                      width: 32, // Smaller buttons
                      height: 32,
                      "&:hover": {
                        color: social.color,
                        backgroundColor: `${social.color}10`,
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>

              {/* Copyright */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem", // Smaller font
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                © {currentYear}
                <Favorite sx={{ fontSize: 12, color: "#E91E63" }} />
                Tel Aviv
              </Typography>
            </Stack>
          </Stack>

          {/* Mobile copyright */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.75rem",
              textAlign: "center",
              mt: 1,
              display: { xs: "block", sm: "none" },
            }}
          >
            © {currentYear} TuneYourMood • Made with <Favorite sx={{ fontSize: 12, color: "#E91E63", mx: 0.5 }} /> in
            Tel Aviv
          </Typography>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      {isScrollToTopVisible && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20, // Reduced from 32
            right: 20, // Reduced from 32
            zIndex: 9999,
            transition: "all 0.3s ease",
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={{
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              color: "white",
              width: 40, // Smaller button
              height: 40,
              boxShadow: "0 2px 8px rgba(233, 30, 99, 0.3)", // Reduced shadow
              "&:hover": {
                background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                boxShadow: "0 4px 12px rgba(233, 30, 99, 0.4)",
                transform: "translateY(-1px)", // Reduced movement
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowUp sx={{ fontSize: 20 }} /> {/* Smaller icon */}
          </IconButton>
        </Box>
      )}
    </>
  )
}

export default Footer
