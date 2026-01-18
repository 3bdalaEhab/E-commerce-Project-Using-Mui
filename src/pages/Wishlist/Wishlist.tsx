import React, { useContext, useEffect, useCallback } from "react";
import { WishlistContext, CartContext, useToast } from "../../Context";
import ProductCard from "../../components/Common/ProductCard";
import {
    Box,
    Box,
    Typography,
    Grid,
    Container,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { WishlistSkeleton } from "../../components/Common/Skeletons";
import PageMeta from "../../components/PageMeta/PageMeta";
import EmptyState from "../../components/Common/EmptyState";
import { Product } from "../../types";


export default function Wishlist() {
    const { wishlist, removeFromWishlist, loading, getWishlist, wishListItemId } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        getWishlist();
    }, [getWishlist]);

    const handleAddToCart = useCallback(async (id: string) => {
        try {
            const res = await addToCart(id);
            if (res?.status === "success") {
                showToast("✨ Added to cart", "success");
            } else {
                showToast("Failed to add to cart", "error");
            }
        } catch {
            showToast("Error adding to cart", "error");
        }
    }, [addToCart, showToast]);

    const handleWishlistToggle = useCallback(async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        // Since we are in wishlist page, clicking heart (toggle) usually means removing it
        // matches ProductCard expectation
        try {
            await removeFromWishlist(id);
            showToast("💔 Removed from wishlist", "success");
        } catch {
            showToast("Failed to remove", "error");
        }
    }, [removeFromWishlist, showToast]);

    const handleNavigate = useCallback((id: string) => navigate(`/details/${id}`), [navigate]);

    if (loading) return <WishlistSkeleton />;

    if (!wishlist.length) return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            <PageMeta title="My Wishlist" description="Your wishlist is empty." />
            <EmptyState
                title="Your Wishlist is Empty"
                description="Save the products you love to your wishlist and they'll be here waiting for you. Don't let your favorites slip away!"
                actionText="Explore Products"
                onAction={() => navigate("/")}
                icon={<FavoriteIcon sx={{ fontSize: "3.5rem" }} />}
            />
        </Box>
    );

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
            <PageMeta title="My Wishlist" description="All your favorite items in one place." />

            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>
                        My <Box component="span" sx={{ color: "primary.main" }}>Wishlist</Box>
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Items you've saved for later</Typography>
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
