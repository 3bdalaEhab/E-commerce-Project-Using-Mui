import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import PageMeta from '../PageMeta/PageMeta';

/**
 * Standardized layout for all authentication-related pages.
 * Handles background, padding, animations, and metadata consistently.
 */
const AuthLayout = ({ title, subtitle, description, children, maxWidth = 480 }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                color: theme.palette.text.primary,
                transition: 'background-color 0.4s ease',
            }}
        >
            <PageMeta title={title} description={description} />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        p: { xs: 4, sm: 6 },
                        borderRadius: "24px",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 20px 60px rgba(0,0,0,0.5)'
                            : '0 20px 60px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 1.5,
                                fontWeight: 900,
                                color: theme.palette.text.primary,
                                letterSpacing: '-1.5px',
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body1"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    lineHeight: 1.6,
                                    fontWeight: 500
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {children}
                </Paper>
            </motion.div>
        </Box>
    );
};

export default AuthLayout;
