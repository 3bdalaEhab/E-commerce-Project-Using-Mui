import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { translateAPIContent, translateProductDescription } from "../../utils/localization";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { DetailsSkeleton } from "../../components/Common/Skeletons";
import { CartContext, WishlistContext, useToast, useAuth } from "../../Context";
import PageMeta from "../../components/PageMeta/PageMeta";
import { productService } from "../../services";
import ProductSlider from "../../components/Common/ProductSlider";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import ImageZoom from "../../components/Common/ImageZoom";
import { LocalFireDepartment } from "@mui/icons-material";
import StickyBuyBar from "../../components/Common/StickyBuyBar";
import { ReviewsSection, Review } from "../../components/Reviews";

// Generate mock reviews for demonstration
const generateMockReviews = (productId: string, count: number): Review[] => {
    const reviewTemplates = [
        { name: 'Ahmed Hassan', country: 'eg', rating: 5, title: 'Excellent product!', content: 'I absolutely love this product. The quality is amazing and it arrived quickly.' },
        { name: 'Sara Mohamed', country: 'eg', rating: 4, title: 'Great value for money', content: 'Very satisfied with my purchase. The product matches the description perfectly.' },
        { name: 'John Doe', country: 'us', rating: 5, title: 'Top quality', content: 'Surprised by the build quality. Truly a premium product.' },
        { name: 'Maria Garcia', country: 'es', rating: 5, title: 'Increíble!', content: 'El producto es simplemente fantástico. Superó todas mis expectativas.' },
        { name: 'Khaled Mansour', country: 'sa', rating: 5, title: 'Perfect purchase!', content: 'Exactly what I was looking for. Fast shipping and excellent quality.' },
    ];

    const numReviews = Math.min(Math.max(count, 3), 5);
    return reviewTemplates.slice(0, numReviews).map((template, index) => {
        const createdAt = new Date(Date.now() - (index * 3) * 24 * 60 * 60 * 1000).toISOString();
        return {
            _id: `review-${productId}-${index}`,
            userId: { _id: `user-${index}`, name: template.name, country: template.country },
            productId,
            rating: template.rating,
            title: template.title,
            content: template.content,
            verifiedPurchase: Math.random() > 0.3,
            helpful: Math.floor(Math.random() * 50),
            notHelpful: Math.floor(Math.random() * 5),
            createdAt,
        };
    });
};

const Details: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, wishListItemId } = useContext(WishlistContext);
    const { showToast } = useToast();
    const { userToken } = useAuth();
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { t } = useTranslation();

    const isInWishlist = React.useMemo(() => {
        if (!id) return false;
        return wishListItemId.includes(id);
    }, [id, wishListItemId]);

    const handleWishlistToggle = useCallback(async () => {
        if (!id) return;
        if (!userToken) {
            showToast(t("products.wishlistLoginWarning"), "warning");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(id);
                showToast(t("toasts.removedFromWishlist"), "success");
            } else {
                await addToWishlist(id);
                showToast(t("toasts.addedToWishlist"), "success");
            }
        } catch {
            showToast(t("toasts.error"), "error");
        } finally {
            setWishlistLoading(false);
        }
    }, [id, isInWishlist, removeFromWishlist, addToWishlist, showToast, t, userToken, navigate]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["productDetails", id],
        queryFn: () => productService.getProductById(id as string),
        enabled: !!id,
        select: (data) => data.data
    });

    // Related Products Query
    const { data: relatedProducts } = useQuery({
        queryKey: ["relatedProducts", data?.category?._id, id],
        queryFn: () => productService.getProducts({
            category: data?.category?._id,
            limit: 10
        }),
        enabled: !!data?.category?._id,
        select: (data) => data.data.filter((p) => p._id !== id) // Client-side fallback exclusion
    });


    // Track History
    const recentProducts = useRecentlyViewed(data || null);


    const addCart = useCallback(async () => {
        if (!id) return;
        if (!userToken) {
            showToast(t("products.loginWarning"), "warning");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        try {
            setAddingToCart(true);
            const res = await addToCart(id);
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
    }, [id, addToCart, showToast, t, userToken, navigate]);

    if (isLoading) return <DetailsSkeleton />;

    if (isError || !data) {
        const errorMessage = error instanceof Error ? error.message : t("products.failedToLoadDesc");
        return (
            <Container maxWidth="md" sx={{ py: 10 }}>
                <Alert severity="error" sx={{ borderRadius: "16px" }}>
                    <strong>{t("common.error")}:</strong> {errorMessage}
                    {!userToken && (error as AxiosError)?.response?.status === 404 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                {t("products.loginToView")}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                                size="small"
                            >
                                {t("nav.login")}
                            </Button>
                        </Box>
                    )}
                </Alert>
            </Container>
        );
    }

    const allImages = [data.imageCover, ...(data.images || [])];

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta
                title={translateAPIContent(data.title, 'products')}
                description={translateProductDescription(data.title, data.description)}
                image={data.imageCover}
                type="product"
            />

            <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 10 } }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 4, '& .MuiBreadcrumbs-li': { fontWeight: 600 } }}
                >
                    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                        {t("nav.home")}
                    </MuiLink>
                    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/products">
                        {t("nav.products")}
                    </MuiLink>
                    <Typography color="text.primary" fontWeight="700">
                        {translateAPIContent(data.category?.name, 'categories')}
                    </Typography>
                </Breadcrumbs>

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
                                            <Box sx={{ height: { xs: 300, sm: 400, md: 500 }, bgcolor: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                                                <ImageZoom
                                                    src={img}
                                                    alt={translateAPIContent(data.title, 'products')}
                                                />
                                            </Box>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Chip
                                    label={t("common.premium")}
                                    sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)', fontWeight: 900, borderRadius: '8px' }}
                                />
                            </Box>
                        </Grid>

                        {/* Content */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: { xs: 2.5, sm: 4, md: 6 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Stack spacing={2} mb={4}>
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={translateAPIContent(data.category?.name, 'categories')} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: '8px' }} />
                                        {data.brand && <Chip label={translateAPIContent(data.brand.name, 'brands')} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: '8px' }} />}
                                    </Stack>
                                    <Typography variant="h3" fontWeight="1000" sx={{ letterSpacing: -1.5, lineHeight: 1.1, fontSize: { xs: '1.6rem', sm: '2.2rem', md: '3rem' } }}>
                                        {translateAPIContent(data.title, 'products')}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Rating value={data.ratingsAverage} precision={0.1} readOnly sx={{ color: 'primary.main' }} />
                                        <Typography variant="body2" fontWeight="700">({data.ratingsAverage.toFixed(1)} {t("common.rating")})</Typography>
                                    </Stack>
                                </Stack>

                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: { xs: 1.6, md: 1.8 }, fontSize: { xs: '0.95rem', md: '1rem' }, opacity: 0.8, flex: 1 }}>
                                    {translateProductDescription(data.title, data.description)}
                                </Typography>

                                <Divider sx={{ mb: 4, opacity: 0.5 }} />

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{t("common.price")}</Typography>
                                        <Typography variant="h3" fontWeight="1000" color="primary" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                            {data.price} {t("common.egp")}
                                        </Typography>
                                        {data.quantity <= 10 && (
                                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1, color: 'error.main' }}>
                                                <LocalFireDepartment fontSize="small" sx={{ animation: 'pulse 1.5s infinite' }} />
                                                <Typography variant="caption" fontWeight="800" sx={{ textTransform: 'uppercase' }}>
                                                    {data.quantity === 0 ? t("common.outOfStock") : t("common.highDemand", { count: data.quantity })}
                                                </Typography>
                                            </Stack>
                                        )}
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
                                                minWidth: { xs: '60px', sm: 'auto' },
                                                '& .MuiButton-startIcon': {
                                                    margin: { xs: 0, sm: '0 8px 0 -4px' }
                                                }
                                            }}
                                        >
                                            {addingToCart ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                                    {t("common.addToCart")}
                                                </Box>
                                            )}
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

                {/* Customer Reviews Section - Display Only */}
                <Box sx={{ mt: 6 }}>
                    <ReviewsSection
                        reviews={generateMockReviews(id || '', data.ratingsQuantity || 5)}
                        loading={false}
                        averageRating={data.ratingsAverage}
                        totalReviews={data.ratingsQuantity}
                    />
                </Box>

                {/* Intelligent Discovery Section */}
                <Box sx={{ mt: 10 }}>
                    {relatedProducts && relatedProducts.length > 0 && (
                        <ProductSlider
                            title={t("common.youMayAlsoLike")}
                            products={relatedProducts}
                        />
                    )}

                    {recentProducts.length > 0 && (
                        <ProductSlider
                            title={t("common.recentlyViewed")}
                            products={recentProducts}
                        />
                    )}
                </Box>
            </Container>

            {/* Sticky Action Bar */}
            <StickyBuyBar
                product={data}
                onAddToCart={addCart}
                loading={addingToCart}
            />
        </Box>
    );
};

export default Details;
