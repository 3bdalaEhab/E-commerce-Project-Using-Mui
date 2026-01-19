import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    Grid,
    Rating,
    IconButton,
    Chip,
    Stack,
    Divider,
    useTheme,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useQuickView } from '../../Context/QuickViewContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext, WishlistContext, useToast, useAuth } from '../../Context';
import { translateAPIContent, translateProductDescription } from '../../utils/localization';

const QuickViewModal = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { activeProduct, isOpen, closeQuickView } = useQuickView();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, wishListItemId } = useContext(WishlistContext);
    const { userToken } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    if (!activeProduct) return null;

    const isInWishlist = wishListItemId.includes(activeProduct._id);

    const handleAddToCart = async () => {
        if (!userToken) {
            showToast(t("products.loginWarning"), "warning");
            closeQuickView();
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setAddingToCart(true);
        try {
            const res = await addToCart(activeProduct._id);
            if (res?.status === "success") {
                showToast(t("toasts.addedToCart"), "success");
            } else {
                showToast(res?.message || t("toasts.failedToAddToCart"), "error");
            }
        } catch {
            showToast(t("toasts.error"), "error");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!userToken) {
            showToast(t("products.wishlistLoginWarning"), "warning");
            closeQuickView();
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(activeProduct._id);
                showToast(t("toasts.removedFromWishlist"), "success");
            } else {
                await addToWishlist(activeProduct._id);
                showToast(t("toasts.addedToWishlist"), "success");
            }
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeQuickView}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
                }
            }}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <IconButton
                    onClick={closeQuickView}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': { transform: 'rotate(90deg)', bgcolor: 'error.main', color: 'white' }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent sx={{ p: 0 }}>
                    <Grid container>
                        {/* Image Section */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ bgcolor: 'action.hover', position: 'relative', minHeight: { xs: 300, md: 500 }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                            <img
                                src={activeProduct.imageCover}
                                alt={translateAPIContent(activeProduct.title, 'products')}
                                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}
                            />
                        </Grid>

                        {/* Details Section */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Stack spacing={1} sx={{ mb: 2 }}>
                                    <Chip
                                        label={translateAPIContent(activeProduct.category?.name, 'categories')}
                                        size="small"
                                        sx={{ alignSelf: 'flex-start', fontWeight: 700, borderRadius: '8px' }}
                                    />
                                    <Typography
                                        variant="h4"
                                        fontWeight="900"
                                        sx={{
                                            lineHeight: 1.2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {translateAPIContent(activeProduct.title, 'products')}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Rating value={activeProduct.ratingsAverage} readOnly precision={0.1} size="small" />
                                        <Typography variant="caption" color="text.secondary" fontWeight="700">
                                            ({activeProduct.ratingsAverage} {t("common.rating")})
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 3,
                                        flex: 1,
                                        lineHeight: 1.6,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {translateProductDescription(activeProduct.title, activeProduct.description)}
                                </Typography>

                                <Divider sx={{ mb: 3 }} />

                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="700">{t("common.priceLabel")}</Typography>
                                        <Typography
                                            variant="h4"
                                            fontWeight="900"
                                            color="primary"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {activeProduct.price} {t("common.egp")}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={handleWishlistToggle}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '16px',
                                            bgcolor: isInWishlist ? 'error.main' : 'action.hover',
                                            color: isInWishlist ? 'white' : 'text.secondary',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                    >
                                        {wishlistLoading ? <CircularProgress size={20} color="inherit" /> : isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </Stack>

                                <Stack spacing={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={addingToCart}
                                        onClick={handleAddToCart}
                                        startIcon={!addingToCart && <ShoppingCartIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: '16px',
                                            fontWeight: 900,
                                            whiteSpace: 'nowrap',
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(0,0,0,0.2)' }
                                        }}
                                    >
                                        {addingToCart ? <CircularProgress size={24} color="inherit" /> : t("common.addToCart")}
                                    </Button>

                                    <Link to={`/details/${activeProduct._id}`} onClick={closeQuickView} style={{ textDecoration: 'none' }}>
                                        <Button fullWidth variant="text" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                                            {t("common.viewDetails")}
                                        </Button>
                                    </Link>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default QuickViewModal;
