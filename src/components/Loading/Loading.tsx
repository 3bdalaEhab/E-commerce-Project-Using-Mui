import React from 'react';
import { Box, CircularProgress, Typography, useTheme, Theme } from '@mui/material';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
    const theme = useTheme<Theme>();

    return (
        <Box
            sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <CircularProgress
                    size={80}
                    thickness={4}
                    sx={{
                        color: theme.palette.primary.main,
                        filter: 'drop-shadow(0 0 10px rgba(37, 99, 235, 0.3))',
                    }}
                />
            </motion.div>

            <Typography
                variant="h5"
                sx={{
                    mt: 4,
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: 2,
                }}
                component={motion.p}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                LOADING...
            </Typography>
        </Box>
    );
};

export default Loading;
