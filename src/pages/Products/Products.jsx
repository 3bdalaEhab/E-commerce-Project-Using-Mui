import React, { useContext, useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { ProductSkeleton } from "../../components/Common/Skeletons";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import { useToast } from "../../Context/ToastContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import ProductCard from "../../components/Common/ProductCard";
import { API_BASE_URL } from "../../constants/api";

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishListItemId, removeFromWishlist } = useContext(
    WishlistContext
  );

  const getProducts = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/products`);
    return data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addCart = useCallback(
    async (productId) => {
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
    [addToCart, showToast]
  );

  const handleWishlistToggle = useCallback(
    async (e, productId) => {
      e.stopPropagation();
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
    [wishListItemId, removeFromWishlist, addToWishlist, showToast]
  );

  const handleNavigate = useCallback(
    (id) => navigate("/details/" + id),
    [navigate]
  );

  if (isLoading) return <ProductSkeleton />;

  if (isError)
    return (
      <Box sx={{ p: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error loading products: {error.message}
        </Typography>
      </Box>
    );

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

      <Box sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 4,
          }}
        >
          {data.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              onNavigate={handleNavigate}
              onAddToCart={addCart}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={wishListItemId.includes(product._id)}
              theme={theme}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
