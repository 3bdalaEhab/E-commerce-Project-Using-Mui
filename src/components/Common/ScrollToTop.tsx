import React, { useState, useEffect } from "react";
import { Fab, useTheme, Zoom, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTop = () => {
    const theme = useTheme();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.pageYOffset;

        // Show button after 300px
        if (currentScroll > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        // Calculate progress percentage
        if (totalHeight > 0) {
            const progress = (currentScroll / totalHeight) * 100;
            setScrollProgress(progress);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Stroke circumference for the circle
    const circumference = 2 * Math.PI * 24;

    return (
        <Zoom in={isVisible}>
            <Box
                component="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        scrollToTop();
                    }
                }}
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 99,
                    cursor: 'pointer',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    boxShadow: theme.shadows[6],
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[14],
                        '& .arrow-icon': {
                            color: theme.palette.primary.main
                        }
                    }
                }}
            >
                {/* Progress Circle SVG */}
                <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
                >
                    <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                        strokeWidth="3"
                    />
                    <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke={theme.palette.primary.main}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (scrollProgress / 100) * circumference}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>

                {/* Arrow Icon */}
                <KeyboardArrowUpIcon
                    className="arrow-icon"
                    sx={{
                        color: theme.palette.text.primary,
                        fontSize: 28,
                        transition: 'color 0.3s ease'
                    }}
                />
            </Box>
        </Zoom>
    );
};

export default ScrollToTop;
