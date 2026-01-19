import React, { useContext, useEffect, useCallback } from "react";
import { WishlistContext, CartContext, useToast } from "../../Context";
import ProductCard from "../../components/Common/ProductCard";
import {
    Box,
    Typography,
    Grid,
    Container,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { WishlistSkeleton } from "../../components/Common/Skeletons";
import PageMeta from "../../components/PageMeta/PageMeta";
import EmptyState from "../../components/Common/EmptyState";
import { useTranslation } from "react-i18next";


export default function Wishlist() {
    const { wishlist, removeFromWishlist, loading, getWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        getWishlist();
    }, [getWishlist]);

    const handleAddToCart = useCallback(async (id: string) => {
        try {
            const res = await addToCart(id);
            if (res && (res.status === "success" || res.message === "success")) {
                showToast(t("toasts.addedToCart"), "success");
            } else {
                showToast(t("toasts.failedToAddToCart"), "error");
            }
        } catch {
            showToast(t("toasts.error"), "error");
        }
    }, [addToCart, showToast, t]);

    const handleWishlistToggle = useCallback(async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        // Since we are in wishlist page, clicking heart (toggle) usually means removing it
        // matches ProductCard expectation
        try {
            await removeFromWishlist(id);
            showToast(t("toasts.removedFromWishlist"), "success");
        } catch {
            showToast(t("toasts.failedToRemove"), "error");
        }
    }, [removeFromWishlist, showToast, t]);

    const handleNavigate = useCallback((id: string) => navigate(`/details/${id}`), [navigate]);

    if (loading) return <WishlistSkeleton />;

    if (!wishlist.length) return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            <PageMeta title={t("PageMeta.wishlistTitle")} description={t("PageMeta.wishlistDesc")} />
            <EmptyState
                title={t("wishlist.empty")}
                description={t("wishlist.emptyDesc")}
                actionText={t("wishlist.exploreProducts")}
                onAction={() => navigate("/")}
                icon={<FavoriteIcon sx={{ fontSize: "3.5rem" }} />}
            />
        </Box>
    );

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
            <PageMeta title={t("PageMeta.wishlistTitle")} description={t("PageMeta.wishlistDesc")} />

            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>
                        {t("wishlist.title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">{t("wishlist.subtitle")}</Typography>
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    <AnimatePresence>
                        {wishlist.map((item, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
                                <ProductCard
                                    product={item}
                                    index={index}
                                    onNavigate={handleNavigate}
                                    onAddToCart={handleAddToCart}
                                    onWishlistToggle={handleWishlistToggle}
                                    isWishlisted={true}
                                />
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            </Container>
        </Box>
    );
}
