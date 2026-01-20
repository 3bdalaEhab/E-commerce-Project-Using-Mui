import React from 'react';
import { Box, Typography, Skeleton, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext, WishlistContext, useAuth, useToast } from '../../Context';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';

interface ProductSliderProps {
    title: string;
    products: Product[];
    loading?: boolean;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products, loading }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, wishListItemId } = useContext(WishlistContext);
    const { userToken } = useAuth();
    const { showToast } = useToast();

    if (loading) {
        return (
            <Box sx={{ my: 8 }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '16px' }} />
                            <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                            <Skeleton variant="text" width="40%" />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (!loading && products.length === 0) return null;

    return (
        <Box sx={{ my: 8 }}>
            <Typography
                variant="h4"
                fontWeight="800"
                sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:before': {
                        content: '""',
                        display: 'block',
                        width: 6,
                        height: 32,
                        bgcolor: 'primary.main',
                        borderRadius: 4
                    }
                }}
            >
                {title}
            </Typography>

            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    900: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                }}
                style={{ padding: '4px 4px 40px 4px' }}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={product._id}>
                        <ProductCard
                            product={product}
                            index={index}
                            onNavigate={(id) => {
                                navigate(`/details/${id}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onAddToCart={() => {
                                if (!userToken) {
                                    showToast(t("products.loginWarning"), "warning");
                                    setTimeout(() => navigate('/login'), 1500);
                                    return;
                                }
                                addToCart(product._id);
                            }}
                            onWishlistToggle={(e, id) => {
                                e.stopPropagation();
                                if (!userToken) {
                                    showToast(t("products.wishlistLoginWarning"), "warning");
                                    setTimeout(() => navigate('/login'), 1500);
                                    return;
                                }
                                if (wishListItemId.includes(id)) {
                                    removeFromWishlist(id);
                                } else {
                                    addToWishlist(id);
                                }
                            }}
                            isWishlisted={wishListItemId.includes(product._id)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default ProductSlider;
