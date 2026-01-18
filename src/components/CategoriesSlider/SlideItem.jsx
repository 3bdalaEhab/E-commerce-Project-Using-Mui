import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";

export default function SlideItem({ img }) {
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
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 8s ease",
                }}
            />

            {/* Visual Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: { xs: 4, md: 10 },
                    color: "#fff",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            letterSpacing: "4px",
                            fontWeight: "800",
                            color: theme.palette.primary.light,
                            mb: 1,
                            display: "block",
                        }}
                    >
                        Premium Collection
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: "900",
                            mb: 2,
                            fontSize: { xs: "2.4rem", md: "4rem" },
                            lineHeight: 1.1,
                            letterSpacing: "-2px",
                        }}
                    >
                        {img.title}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "1rem", md: "1.3rem" },
                            color: "rgba(255,255,255,0.8)",
                            maxWidth: "500px",
                            mb: 4,
                            fontWeight: "400",
                        }}
                    >
                        {img.subtitle}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            borderRadius: "50px",
                            px: 5,
                            py: 1.8,
                            fontWeight: "800",
                            textTransform: "none",
                            fontSize: "1.1rem",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: theme.shadows[10],
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
