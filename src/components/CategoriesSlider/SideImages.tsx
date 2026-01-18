import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { sideImagesData } from "../../constants/sliderData";

export default function SideImages() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: { xs: "none", lg: "flex" },
                flex: 1,
                flexDirection: "column",
                gap: 3,
            }}
        >
            {sideImagesData.map((side, i) => (
                <Box
                    key={i}
                    component={motion.div}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    sx={{
                        flex: 1,
                        position: "relative",
                        borderRadius: "24px",
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow:
                            theme.palette.mode === "dark"
                                ? "0 10px 30px rgba(0,0,0,0.3)"
                                : "0 10px 30px rgba(0,0,0,0.06)",
                        "&:hover img": { transform: "scale(1.1)" },
                        "&:hover .side-overlay": { bgcolor: "rgba(0,0,0,0.5)" },
                    }}
                >
                    <Box
                        component="img"
                        src={side.src}
                        alt={side.label}
                        sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "24px",
                            objectFit: "cover",
                            transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    />
                    <Box
                        className="side-overlay"
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 50%, transparent 100%)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            p: 4,
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            ".side-text": { transform: "translateY(10px)", opacity: 0.8, transition: "all 0.4s ease" },
                            "&:hover .side-text": { transform: "translateY(0)", opacity: 1 },
                        }}
                    >
                        <Box className="side-text">
                            <Typography
                                variant="h5"
                                sx={{ color: "#fff", fontWeight: "1000", letterSpacing: "-0.5px", lineHeight: 1 }}
                            >
                                {side.label}
                            </Typography>
                            <Typography
                                variant="button"
                                sx={{ color: theme.palette.primary.light, mt: 1, display: 'block', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '1px' }}
                            >
                                EXPLORE NOW
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
