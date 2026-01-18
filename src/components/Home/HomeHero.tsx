import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    useTheme,
    Stack,
    useMediaQuery,
} from '@mui/material';
import { ArrowForward, LocalOffer } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Placeholder for the hero image. In a real scenario, this would be an asset imported or in public folder.
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop";

const HomeHero: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                perspective: '1000px',
            }}
        >
            {/* Background Image with Parallax-like scale */}
            <Box
                component={motion.div}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${HERO_IMAGE_URL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -2,
                }}
            />

            {/* Gradient Overlay for Readability */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg, ${theme.palette.background.default} 0%, rgba(0,0,0,0.6) 100%)`, // Fade from solid color to transparent
                    zIndex: -1,
                    opacity: 0.95
                }}
            />

            {/* Decorative blob */}
            <Box
                component={motion.div}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '60vw',
                    height: '60vw',
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    filter: 'blur(150px)',
                    opacity: 0.15,
                    zIndex: -1,
                }}
            />

            <Container maxWidth="xl">
                <Stack
                    spacing={4}
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    maxWidth="800px"
                >
                    <Box component={motion.div} variants={itemVariants}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <LocalOffer sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                            <Typography
                                variant="subtitle1"
                                fontWeight="700"
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    color: 'primary.main'
                                }}
                            >
                                New Collection 2026
                            </Typography>
                        </Stack>
                    </Box>

                    <Box component={motion.div} variants={itemVariants}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '3rem', md: '5.5rem' },
                                letterSpacing: '-0.03em',
                                lineHeight: 1.1,
                                color: 'text.primary',
                            }}
                        >
                            Future of <br />
                            <Box
                                component="span"
                                sx={{
                                    color: 'transparent',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                }}
                            >
                                Technology
                            </Box>
                        </Typography>
                    </Box>

                    <Box component={motion.div} variants={itemVariants}>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{
                                maxWidth: '600px',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}
                        >
                            Experience the next generation of smart living.
                            Curated devices that blend seamlessly into your lifestyle.
                        </Typography>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        component={motion.div}
                        variants={itemVariants}
                        pt={2}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/products')}
                            endIcon={<ArrowForward />}
                            sx={{
                                borderRadius: '50px',
                                px: 5,
                                py: 1.8,
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 10px 30px rgba(0,0,0,0.5)'
                                    : '0 10px 30px rgba(37, 99, 235, 0.3)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 15px 40px rgba(0,0,0,0.6)'
                                        : '0 15px 40px rgba(37, 99, 235, 0.4)',
                                }
                            }}
                        >
                            Shop Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/products?sort=-sold')}
                            sx={{
                                borderRadius: '50px',
                                px: 5,
                                py: 1.8,
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderWidth: '2px',
                                '&:hover': {
                                    borderWidth: '2px',
                                    bgcolor: 'transparent',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            Best Sellers
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default HomeHero;
