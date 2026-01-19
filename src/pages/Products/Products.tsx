import React, { useContext, useCallback, useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
    Box,
    Typography,
    Container,
} from "@mui/material";
import { ProductSkeleton } from "../../components/Common/Skeletons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartContext, WishlistContext, useToast, useAuth } from "../../Context";
import PageMeta from "../../components/PageMeta/PageMeta";
import EmptyState from "../../components/Common/EmptyState";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ProductCard from "../../components/Common/ProductCard";
import ProductFilterBar from "../../components/Common/ProductFilterBar";
import { motion, Variants } from "framer-motion";
import { productService } from "../../services";
import { Product } from "../../types";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // Reduced from 0.1
            delayChildren: 0.1 // Reduced from 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4, // Reduced from 0.6
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const Products: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const urlKeyword = searchParams.get('keyword') || "";
    const urlCategory = searchParams.get('category') || "";

    const { showToast } = useToast();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, wishListItemId, removeFromWishlist } = useContext(WishlistContext);
    const { userToken } = useAuth();

    // Filter States
    const [searchQuery, setSearchQuery] = useState(urlKeyword);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [sortOption, setSortOption] = useState("price");
    const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);

    // Sync state with URL keyword if it changes from external (global) search
    useEffect(() => {
        setSearchQuery(urlKeyword);
        setSelectedCategory(urlCategory);
    }, [urlKeyword, urlCategory]);

    const { data: productsData, isLoading, isError, isFetching } = useQuery({
        queryKey: ["products", searchQuery, selectedCategory, sortOption, priceRange],
        queryFn: () => productService.getProducts({
            keyword: searchQuery || undefined,
            category: selectedCategory || undefined,
            sort: sortOption,
            'price[gte]': priceRange[0],
            'price[lte]': priceRange[1],
            limit: 50,
        }),
        placeholderData: keepPreviousData
    });

    const products = productsData?.data || [];

    const addCart = useCallback(
        async (productId: string) => {
            if (!userToken) {
                showToast(t("products.loginWarning"), "warning");
                setTimeout(() => navigate('/login'), 1500);
                return;
            }
            try {
                const res = await addToCart(productId);
                if (res?.status === "success") {
                    showToast(t("toasts.addedToCart"), "success");
                } else {
                    showToast(t("toasts.failedToAddToCart"), "error");
                }
            } catch {
                showToast(t("toasts.serverError"), "error");
            }
        },
        [addToCart, showToast, userToken, navigate, t]
    );

    const handleWishlistToggle = useCallback(
        async (e: React.MouseEvent, productId: string) => {
            e.stopPropagation();
            if (!userToken) {
                showToast(t("products.wishlistLoginWarning"), "warning");
                setTimeout(() => navigate('/login'), 1500);
                return;
            }
            try {
                if (wishListItemId.includes(productId)) {
                    await removeFromWishlist(productId);
                    showToast(t("toasts.removedFromWishlist"), "success");
                } else {
                    await addToWishlist(productId);
                    showToast(t("toasts.addedToWishlist"), "success");
                }
            } catch {
                showToast(t("toasts.wishlistUpdateFailed"), "error");
            }
        },
        [wishListItemId, removeFromWishlist, addToWishlist, showToast, userToken, navigate, t]
    );

    const handleNavigate = useCallback(
        (id: string) => navigate("/details/" + id),
        [navigate]
    );

    if (isLoading) return <ProductSkeleton />;

    if (isError) {
        return (
            <EmptyState
                title={t("products.failedToLoad")}
                description={t("products.failedToLoadDesc")}
                actionText={t("common.refreshPage")}
                onAction={() => window.location.reload()}
                icon={<Box sx={{ color: 'error.main' }}>⚠️</Box>}
            />
        );
    }

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta
                title={t("PageMeta.productsTitle")}
                description={t("PageMeta.productsDesc")}
            />

            <Box sx={{ pt: 8, pb: 4, textAlign: "center" }}>
                <Typography
                    variant="h3"
                    fontWeight="900"
                    sx={{ mb: 1, letterSpacing: -1 }}
                >
                    Premium{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>
                        {t("products.catalog")}
                    </Box>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("products.subtitle")}
                </Typography>
            </Box>

            <Container maxWidth="xl">
                <ProductFilterBar
                    onSort={setSortOption}
                    onPriceChange={setPriceRange}
                    maxPrice={50000}
                />

                <Box sx={{ px: { xs: 0, sm: 2 } }}>
                    {products.length === 0 && !isLoading ? (
                        <EmptyState
                            title={t("products.noItems")}
                            description={t("products.noItemsDesc", { search: searchQuery })}
                            actionText={t("products.clearFilters")}
                            onAction={() => {
                                setSearchQuery("");
                                setSelectedCategory("");
                                navigate("/products");
                            }}
                            icon={<SearchOffIcon sx={{ fontSize: '3.5rem' }} />}
                        />
                    ) : (
                        <Box
                            component={motion.div}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }} // Adjusted margin for better visibility trigger
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: 4,
                                opacity: isFetching ? 0.5 : 1, // Subtle fade only
                                transition: 'opacity 0.2s ease',
                                pointerEvents: isFetching ? 'none' : 'auto'
                            }}
                        >
                            {products.map((product: Product) => (
                                <motion.div key={product._id} variants={itemVariants}>
                                    <ProductCard
                                        product={product}
                                        index={0} // Index delay handled by staggerChildren
                                        onNavigate={handleNavigate}
                                        onAddToCart={addCart}
                                        onWishlistToggle={handleWishlistToggle}
                                        isWishlisted={wishListItemId.includes(product._id)}
                                    />
                                </motion.div>
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Products;
