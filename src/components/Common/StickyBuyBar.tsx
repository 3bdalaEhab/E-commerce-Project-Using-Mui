import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Slide, Avatar, Stack, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Product } from '../../types';

interface StickyBuyBarProps {
    product: Product;
    onAddToCart: () => void;
    loading: boolean;
}

const StickyBuyBar: React.FC<StickyBuyBarProps> = ({ product, onAddToCart, loading }) => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 800px (past main details)
            if (window.scrollY > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                    zIndex: 98, // Below ScrollToTop (99)
                    py: 1.5
                }}
            >
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        {/* Product Info (Hidden on mobile) */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Avatar src={product.imageCover} alt={product.title} variant="rounded" sx={{ width: 48, height: 48 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight="800" noWrap sx={{ maxWidth: 300 }}>
                                    {product.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight="700">
                                    ${product.price}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Price (Mobile Only) */}
                        <Typography variant="h6" fontWeight="900" sx={{ display: { xs: 'block', md: 'none' } }}>
                            ${product.price}
                        </Typography>

                        {/* Action */}
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={onAddToCart}
                            startIcon={<ShoppingCartIcon />}
                            sx={{
                                borderRadius: '12px',
                                px: 4,
                                py: 1,
                                fontWeight: 800,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                boxShadow: theme.shadows[4]
                            }}
                        >
                            Add to Cart
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Slide>
    );
};

export default StickyBuyBar;
