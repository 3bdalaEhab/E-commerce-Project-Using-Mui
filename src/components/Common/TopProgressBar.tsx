import React, { useEffect, useState } from "react";
import { Box, useTheme, LinearProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

const TopProgressBar: React.FC = () => {
    const theme = useTheme();
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        setProgress(10);

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 90) {
                    clearInterval(timer);
                    return 90;
                }
                const diff = Math.random() * 20;
                return Math.min(oldProgress + diff, 90);
            });
        }, 300);

        const finishTimer = setTimeout(() => {
            clearInterval(timer);
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        }, 800);

        return () => {
            clearInterval(timer);
            clearTimeout(finishTimer);
        };
    }, [location.pathname]);

    if (!visible) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.tooltip + 1,
            }}
        >
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 3,
                    bgcolor: "transparent",
                    "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 0 10px ${theme.palette.primary.main}`,
                    },
                }}
            />
        </Box>
    );
};

export default TopProgressBar;
