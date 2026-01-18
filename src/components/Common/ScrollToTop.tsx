import React, { useState, useEffect } from "react";
import { Fab, useTheme, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTop = () => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <Zoom in={isVisible}>
            <Fab
                onClick={scrollToTop}
                color="primary"
                size="medium"
                aria-label="scroll back to top"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 99,
                    boxShadow: theme.shadows[10],
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: "white",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 10px 20px ${theme.palette.primary.main}60`,
                    },
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;
