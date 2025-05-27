"use client"
import { useState, useEffect } from "react"
import { Box, Container, Grid, Typography, Button, IconButton, Stack } from "@mui/material"
import {
  Email,
  Phone,
  LocationOn,
  GitHub,
  LinkedIn,
  Twitter,
  Instagram,
  KeyboardArrowUp,
  Favorite,
  Headphones,
} from "@mui/icons-material"
import { motion } from "framer-motion"

const Footer = () => {
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false)
  const currentYear = new Date().getFullYear()

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Music Player", href: "#player" },
      { name: "Mood Analysis", href: "#mood" },
      { name: "API", href: "#api" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#team" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact", href: "#contact" },
      { name: "FAQ", href: "#faq" },
      { name: "Community", href: "#community" },
    ],
  }

  const socialLinks = [
    { name: "GitHub", icon: <GitHub />, href: "https://github.com", color: "#333" },
    { name: "LinkedIn", icon: <LinkedIn />, href: "https://linkedin.com", color: "#0077B5" },
    { name: "Twitter", icon: <Twitter />, href: "https://twitter.com", color: "#1DA1F2" },
    { name: "Instagram", icon: <Instagram />, href: "https://instagram.com", color: "#E4405F" },
  ]

  return (
    <>
      {/* Main Footer */}
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)",
          color: "#121212",
          mt: 8, // Added top margin
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Border */}
        <Box
          sx={{
            height: "4px",
            background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
          }}
        />

        {/* Main Footer Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                      p: 1.5,
                      borderRadius: "12px",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Headphones sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    TuneYourMood
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Transform your music experience with AI-powered mood analysis and intelligent recommendations.
                </Typography>

                {/* Contact Info */}
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Email sx={{ fontSize: 18, color: "#E91E63" }} />
                    <Typography variant="body2" color="text.secondary">
                      contact@tuneyourmood.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Phone sx={{ fontSize: 18, color: "#E91E63" }} />
                    <Typography variant="body2" color="text.secondary">
                      +972 52-718-5040
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LocationOn sx={{ fontSize: 18, color: "#E91E63" }} />
                    <Typography variant="body2" color="text.secondary">
                      Tel Aviv, Israel
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Links Sections */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Product Links */}
                <Grid item xs={4} md={4}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      color: "#E91E63",
                      fontSize: "1rem",
                    }}
                  >
                    Product
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.product.map((link) => (
                      <Button
                        key={link.name}
                        href={link.href}
                        sx={{
                          color: "text.secondary",
                          justifyContent: "flex-start",
                          p: 0.5,
                          fontSize: "0.875rem",
                          "&:hover": {
                            color: "#E91E63",
                            backgroundColor: "rgba(233,30,99,0.05)",
                          },
                        }}
                      >
                        {link.name}
                      </Button>
                    ))}
                  </Stack>
                </Grid>

                {/* Company Links */}
                <Grid item xs={4} md={4}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      color: "#E91E63",
                      fontSize: "1rem",
                    }}
                  >
                    Company
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.company.map((link) => (
                      <Button
                        key={link.name}
                        href={link.href}
                        sx={{
                          color: "text.secondary",
                          justifyContent: "flex-start",
                          p: 0.5,
                          fontSize: "0.875rem",
                          "&:hover": {
                            color: "#E91E63",
                            backgroundColor: "rgba(233,30,99,0.05)",
                          },
                        }}
                      >
                        {link.name}
                      </Button>
                    ))}
                  </Stack>
                </Grid>

                {/* Support Links */}
                <Grid item xs={4} md={4}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      color: "#E91E63",
                      fontSize: "1rem",
                    }}
                  >
                    Support
                  </Typography>
                  <Stack spacing={1}>
                    {footerLinks.support.map((link) => (
                      <Button
                        key={link.name}
                        href={link.href}
                        sx={{
                          color: "text.secondary",
                          justifyContent: "flex-start",
                          p: 0.5,
                          fontSize: "0.875rem",
                          "&:hover": {
                            color: "#E91E63",
                            backgroundColor: "rgba(233,30,99,0.05)",
                          },
                        }}
                      >
                        {link.name}
                      </Button>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* Bottom Bar */}
        <Box sx={{ bgcolor: "#F5F5F5", py: 3 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              {/* Copyright */}
              <Grid item xs={12} md={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  © {currentYear} TuneYourMood. Made with
                  <Favorite sx={{ fontSize: 14, color: "#E91E63" }} />
                  in Tel Aviv
                </Typography>
              </Grid>

              {/* Social Links */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  {socialLinks.map((social) => (
                    <IconButton
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          color: social.color,
                          backgroundColor: `${social.color}10`,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-end" },
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#4CAF50",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                        "100%": { opacity: 1 },
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                    All systems operational
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Scroll to Top Button */}
      {isScrollToTopVisible && (
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={{
              background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
              color: "white",
              width: 48,
              height: 48,
              boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #D81B60 0%, #F4511E 100%)",
                boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowUp />
          </IconButton>
        </Box>
      )}
    </>
  )
}

export default Footer
