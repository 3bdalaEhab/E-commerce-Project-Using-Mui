import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { SliderImage } from "../../constants/sliderData";

interface SlideItemProps {
    img: SliderImage;
}

export default function SlideItem({ img }: SlideItemProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "relative",
                height: { xs: "350px", md: "520px" },
                overflow: "hidden",
            }}
        >
            <Box
                component="img"
                src={img.src}
                alt={img.title}
                decoding="async"
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 8s ease",
                }}
            />

            {/* Premium Visual Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(90deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 50%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: { xs: 4, md: 12 },
                    color: "#fff",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            letterSpacing: "6px",
                            fontWeight: "900",
                            color: theme.palette.primary.light,
                            mb: 2,
                            display: "block",
                            textTransform: "uppercase",
                            fontSize: "0.85rem",
                            opacity: 0.9
                        }}
                    >
                        Exclusive Collection 2026
                    </Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: "1000",
                            mb: 2,
                            fontSize: { xs: "2.8rem", md: "4.5rem" },
                            lineHeight: 1,
                            letterSpacing: "-3px",
                            background: "linear-gradient(to bottom, #ffffff, #94a3b8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {img.title}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "1rem", md: "1.4rem" },
                            color: "rgba(255,255,255,0.7)",
                            maxWidth: "600px",
                            mb: 5,
                            fontWeight: "500",
                            lineHeight: 1.6,
                        }}
                    >
                        {img.subtitle}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            borderRadius: "16px",
                            px: 6,
                            py: 2.2,
                            fontWeight: "900",
                            textTransform: "none",
                            fontSize: "1.2rem",
                            letterSpacing: "-0.5px",
                            boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.4)",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            "&:hover": {
                                transform: "translateY(-4px) scale(1.02)",
                                boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.5)",
                            },
                        }}
                    >
                        {img.buttonText}
                    </Button>
                </motion.div>
            </Box>
        </Box>
    );
}
