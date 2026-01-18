import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Rating,
    Divider,
    Chip,
    useTheme,
    Stack,
    Container,
    Paper,
    Grid,
    IconButton,
    CircularProgress,
    Alert,
} from "@mui/material";
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "../../components/Loading/Loading";
import { CartContext, WishlistContext, useToast } from "../../Context";
import PageMeta from "../../components/PageMeta/PageMeta";
import { productService } from "../../services";

const Details: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, wishListItemId } = useContext(WishlistContext);
    const { showToast } = useToast();
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const isInWishlist = React.useMemo(() => {
        if (!id) return false;
        return wishListItemId.includes(id);
    }, [id, wishListItemId]);

    const handleWishlistToggle = async () => {
        if (!id) return;
        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(id);
                showToast("💔 Removed from your wishlist", "success");
            } else {
                await addToWishlist(id);
                showToast("❤️ Added to your wishlist", "success");
            }
        } catch (error) {
            showToast("❌ An error occurred. Please try again.", "error");
        } finally {
            setWishlistLoading(false);
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["productDetails", id],
        queryFn: () => productService.getProductById(id!),
        enabled: !!id,
        select: (data) => data.data
    });

    async function addCart() {
        if (!id) return;
        try {
            setAddingToCart(true);
            const res = await addToCart(id);
            if (res?.status === "success") {
                showToast("✨ Product added to your premium collection!", "success");
            } else {
                showToast(res?.message || "Failed to add product.", "error");
            }
        } catch {
            showToast("❌ Connection error. Please try again.", "error");
        } finally {
            setAddingToCart(false);
        }
    }

    if (isLoading) return <Loading />;

    if (isError || !data) {
        const errorMessage = error instanceof Error ? error.message : "Could not load product details.";
        return (
            <Container maxWidth="md" sx={{ py: 10 }}>
                <Alert severity="error" sx={{ borderRadius: "16px" }}>
                    <strong>Error loading product details:</strong> {errorMessage}
                </Alert>
            </Container>
        );
    }

    const allImages = [data.imageCover, ...(data.images || [])];

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta title={data.title} description={data.description.slice(0, 160)} />

            <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 10 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: "32px",
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: "background.paper",
                        boxShadow: theme.palette.mode === 'dark' ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.05)",
                    }}
                >
                    <Grid container>
                        {/* Image Gallery */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 2, md: 4 }, borderRight: { md: `1px solid ${theme.palette.divider}` } }}>
                            <Box sx={{ position: 'relative' }}>
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 4000 }}
                                    loop
                                    style={{ borderRadius: "24px", overflow: 'hidden' }}
                                >
                                    {allImages.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <Box sx={{ height: { xs: 350, md: 500 }, bgcolor: 'action.hover' }}>
                                                <img
                                                    src={img}
                                                    alt={data.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                />
                                            </Box>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Chip
                                    label="PREMIUM"
                                    sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)', fontWeight: 900, borderRadius: '8px' }}
                                />
                            </Box>
                        </Grid>

                        {/* Content */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: { xs: 4, md: 6 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Stack spacing={2} mb={4}>
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={data.category?.name} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: '8px' }} />
                                        {data.brand && <Chip label={data.brand.name} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: '8px' }} />}
                                    </Stack>
                                    <Typography variant="h3" fontWeight="1000" sx={{ letterSpacing: -1.5, lineHeight: 1.1 }}>
                                        {data.title}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Rating value={data.ratingsAverage} precision={0.1} readOnly sx={{ color: 'primary.main' }} />
                                        <Typography variant="body2" fontWeight="700">({data.ratingsAverage.toFixed(1)} Rating)</Typography>
                                    </Stack>
                                </Stack>

                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, flex: 1 }}>
                                    {data.description}
                                </Typography>

                                <Divider sx={{ mb: 4, opacity: 0.5 }} />

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase' }}>Price</Typography>
                                        <Typography variant="h3" fontWeight="1000" color="primary">
                                            ${data.price}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            startIcon={!addingToCart && <ShoppingCartIcon />}
                                            disabled={addingToCart}
                                            onClick={addCart}
                                            sx={{
                                                borderRadius: "14px",
                                                py: 2,
                                                fontWeight: "900",
                                                textTransform: "none",
                                                fontSize: "1.1rem",
                                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                "&:hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[10] }
                                            }}
                                        >
                                            {addingToCart ? <CircularProgress size={24} color="inherit" /> : "Add to Cart"}
                                        </Button>
                                        <IconButton
                                            onClick={handleWishlistToggle}
                                            disabled={wishlistLoading}
                                            sx={{
                                                bgcolor: isInWishlist ? 'error.main' : 'action.hover',
                                                color: isInWishlist ? 'white' : 'text.secondary',
                                                borderRadius: '14px',
                                                width: 60,
                                                height: 60,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                "&:hover": {
                                                    bgcolor: isInWishlist ? 'error.dark' : 'action.selected',
                                                    transform: 'scale(1.1)',
                                                }
                                            }}
                                        >
                                            {wishlistLoading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : isInWishlist ? (
                                                <FavoriteIcon />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Details;
