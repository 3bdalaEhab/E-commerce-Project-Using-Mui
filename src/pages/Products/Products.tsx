import React, { useContext, useCallback, useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
    Box,
    Typography,
    Container,
} from "@mui/material";
import SkeletonLoader from "../../components/Common/SkeletonLoader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext, WishlistContext, useToast, tokenContext } from "../../Context";
import PageMeta from "../../components/PageMeta/PageMeta";
import ProductCard from "../../components/Common/ProductCard";
import ProductFilterBar from "../../components/Common/ProductFilterBar";
import { motion } from "framer-motion";
import { productService } from "../../services";
import { Product } from "../../types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const Products: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const urlKeyword = searchParams.get('keyword') || "";
    const urlCategory = searchParams.get('category') || "";

    const { showToast } = useToast();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, wishListItemId, removeFromWishlist } = useContext(WishlistContext);
    const { userToken } = useContext<any>(tokenContext);

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

    const { data: productsData, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ["products", searchQuery, selectedCategory, sortOption, priceRange],
        queryFn: () => productService.getProducts({
            keyword: searchQuery || undefined,
            category: selectedCategory || undefined,
            sort: sortOption,
            'price[gte]': priceRange[0],
            'price[lte]': priceRange[1],
            limit: 50, // Increased limit to show more products
        }),
        placeholderData: keepPreviousData
    });

    const products = productsData?.data || [];

    const addCart = useCallback(
        async (productId: string) => {
            if (!userToken) {
                showToast("👋 Please login to add items to your cart", "warning");
                setTimeout(() => navigate('/login'), 1500);
                return;
            }
            try {
                const res = await addToCart(productId);
                if (res?.status === "success") {
                    showToast("✅ Product added to cart", "success");
                } else {
                    showToast("❌ Failed to add to cart", "error");
                }
            } catch {
                showToast("❌ Server error", "error");
            }
        },
        [addToCart, showToast, userToken, navigate]
    );

    const handleWishlistToggle = useCallback(
        async (e: React.MouseEvent, productId: string) => {
            e.stopPropagation();
            if (!userToken) {
                showToast("❤ Please login to save items to your wishlist", "warning");
                setTimeout(() => navigate('/login'), 1500);
                return;
            }
            try {
                if (wishListItemId.includes(productId)) {
                    await removeFromWishlist(productId);
                    showToast("💔 Removed from wishlist", "success");
                } else {
                    await addToWishlist(productId);
                    showToast("❤️ Added to wishlist", "success");
                }
            } catch {
                showToast("❌ Wishlist update failed", "error");
            }
        },
        [wishListItemId, removeFromWishlist, addToWishlist, showToast, userToken, navigate]
    );

    const handleNavigate = useCallback(
        (id: string) => navigate("/details/" + id),
        [navigate]
    );

    if (isLoading) return (
        <Container maxWidth="xl" sx={{ py: 10 }}>
            <SkeletonLoader count={8} type="product" />
        </Container>
    );

    if (isError) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return (
            <Box sx={{ p: 10, textAlign: "center" }}>
                <Typography variant="h5" color="error">
                    Error loading products: {errorMessage}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta
                title="Shop Products"
                description="Discover premium products at best prices."
            />

            <Box sx={{ pt: 8, pb: 4, textAlign: "center" }}>
                <Typography
                    variant="h3"
                    fontWeight="900"
                    sx={{ mb: 1, letterSpacing: -1 }}
                >
                    Premium{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>
                        Catalog
                    </Box>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Handpicked items tailored for your lifestyle
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
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h5" color="text.secondary">
                                No products found matching your criteria.
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            component={motion.div}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
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
