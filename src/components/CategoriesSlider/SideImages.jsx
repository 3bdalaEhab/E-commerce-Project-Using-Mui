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
                            bgcolor: "rgba(0,0,0,0.35)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            p: 3,
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: "#fff", fontWeight: "900", lineHeight: 1 }}
                        >
                            {side.label}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}
                        >
                            {side.sub}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
