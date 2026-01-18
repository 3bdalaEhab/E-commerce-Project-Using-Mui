import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Paper,
    Tooltip,
    useTheme,
    Zoom,
    Fab,
    Stack
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PaletteIcon from '@mui/icons-material/Palette';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useThemeContext } from '../../Context/ThemeContext';

const colorOptions = [
    { name: 'Elite Blue', value: '#2563eb' },
    { name: 'Emerald Peak', value: '#10b981' },
    { name: 'Rose Luxe', value: '#e11d48' },
    { name: 'Amber Gold', value: '#f59e0b' },
    { name: 'Violet Night', value: '#7c3aed' },
];

const ThemeCustomizer: React.FC = () => {
    const { primaryColor, setPrimaryColor } = useThemeContext();
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();

    return (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}>
            {/* 💎 Main Action Button */}
            <Fab
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    bgcolor: primaryColor,
                    color: '#fff',
                    '&:hover': {
                        bgcolor: primaryColor,
                        transform: 'scale(1.1) rotate(15deg)',
                    },
                    boxShadow: `0 8px 25px ${primaryColor}60`,
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
            >
                {isOpen ? <CloseIcon /> : <PaletteIcon />}
            </Fab>

            {/* 🎨 Customizer Panel */}
            <AnimatePresence>
                {isOpen && (
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, y: -80, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8, x: -20 }}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            p: 3,
                            borderRadius: '32px',
                            minWidth: '220px',
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 20px 50px rgba(0,0,0,0.5)'
                                : '0 20px 50px rgba(0,0,0,0.1)',
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(15, 23, 42, 0.95)'
                                : 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 2, textAlign: 'center' }}>
                            Accent Color
                        </Typography>

                        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" gap={1.5}>
                            {colorOptions.map((color) => (
                                <Tooltip key={color.value} title={color.name} placement="top" TransitionComponent={Zoom}>
                                    <Box
                                        onClick={() => setPrimaryColor(color.value)}
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: '12px',
                                            bgcolor: color.value,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            border: primaryColor === color.value
                                                ? `3px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`
                                                : '1px solid transparent',
                                            '&:hover': {
                                                transform: 'scale(1.15) translateY(-4px)',
                                                boxShadow: `0 8px 15px ${color.value}80`,
                                            },
                                        }}
                                    >
                                        {primaryColor === color.value && (
                                            <CheckIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
                                        )}
                                    </Box>
                                </Tooltip>
                            ))}
                        </Stack>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 3, display: 'block', textAlign: 'center', fontWeight: 'bold', opacity: 0.6 }}
                        >
                            PERSONALIZED EXPERIENCE
                        </Typography>
                    </Paper>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default ThemeCustomizer;
