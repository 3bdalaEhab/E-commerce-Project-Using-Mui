import React, { ReactNode } from "react";
import {
    Box,
    Typography,
    Container,
    useTheme,
    Grid
} from "@mui/material";
import { motion } from "framer-motion";
import { useThemeContext } from "../../Context/ThemeContext";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    illustration?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, illustration }) => {
    const theme = useTheme();
    const { primaryColor } = useThemeContext();

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default", overflow: "hidden" }}>
            <Grid container sx={{ width: '100%' }}>
                {/* 🎨 Left Side: Brand & Illustration (Hidden on Mobile) */}
                <Grid size={{ xs: 12, md: 6, lg: 7 }} sx={{
                    display: { xs: "none", md: "flex" },
                    bgcolor: theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.3)" : "rgba(37, 99, 235, 0.02)",
                    p: 8,
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    {/* Floating Decorative Elements */}
                    <Box sx={{
                        position: "absolute",
                        top: "-10%",
                        left: "-10%",
                        width: "40%",
                        height: "40%",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`
                    }} />
                    <Box sx={{
                        position: "absolute",
                        bottom: "-10%",
                        right: "-10%",
                        width: "40%",
                        height: "40%",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${primaryColor}10 0%, transparent 70%)`
                    }} />

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Typography variant="h2" sx={{
                            fontWeight: 1000,
                            mb: 2,
                            letterSpacing: "-2px",
                            background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: "500px", lineHeight: 1.6 }}>
                            {subtitle}
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        {illustration || (
                            <Box sx={{ width: "100%", maxWidth: "600px" }}>
                                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: primaryColor, stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: primaryColor, stopOpacity: 0.6 }} />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="250" cy="250" r="150" fill="url(#grad1)" opacity="0.1" />
                                    <path d="M150,250 Q250,100 350,250 T250,400 T150,250" fill="url(#grad1)" opacity="0.8">
                                        <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="20s" repeatCount="indefinite" />
                                    </path>
                                    <rect x="200" y="200" width="100" height="100" rx="20" fill="#fff" opacity="0.9">
                                        <animate attributeName="y" values="200;180;200" dur="4s" repeatCount="indefinite" />
                                    </rect>
                                </svg>
                            </Box>
                        )}
                    </motion.div>
                </Grid>

                {/* 📝 Right Side: Form Content */}
                <Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, sm: 4, md: 6, lg: 10 },
                    bgcolor: "background.default"
                }}>
                    <Container maxWidth="sm">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Box sx={{
                                display: { xs: "block", md: "none" },
                                mb: 4,
                                textAlign: "center"
                            }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 1000,
                                    background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 1,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                }}>
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            </Box>

                            {children}
                        </motion.div>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuthLayout;
