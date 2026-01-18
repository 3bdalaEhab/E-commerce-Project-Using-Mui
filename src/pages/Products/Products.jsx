import React, { useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import { Star, Favorite } from "@mui/icons-material";
import { ProductSkeleton } from "../../components/Common/Skeletons";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import { useToast } from "../../Context/ToastContext";
import PageMeta from "../../components/PageMeta/PageMeta";

// 🔹 Memoized Product Card Component
const ProductCard = React.memo(({ product, index, onNavigate, onAddToCart, onWishlistToggle, isWishlisted, theme }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
    }),
    hover: {
      y: -8,
      boxShadow: theme.palette.mode === "light"
        ? "0 12px 30px rgba(0,0,0,0.12)"
        : "0 12px 30px rgba(0,0,0,0.4)",
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      custom={index % 4}
      viewport={{ once: true, amount: 0.2 }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Card
        sx={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: "24px",
          backgroundColor: theme.palette.background.paper,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.06)"
          },
        }}
        onClick={() => onNavigate(product._id)}
      >
        <CardMedia
          component="img"
          image={product.imageCover}
          alt={product.title}
          sx={{ height: 260, objectFit: "cover" }}
        />

        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" fontWeight="800" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
              {product.category?.name}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 1, letterSpacing: '-0.5px' }}>
              {product.title.split(" ").slice(0, 3).join(" ")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6
            }}>
              {product.description}
            </Typography>
          </Box>

          <Box sx={{ mt: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="h5" fontWeight="900" color="text.primary">
                ${product.price}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: theme.palette.action.hover, px: 1, py: 0.5, borderRadius: '8px' }}>
                <Star sx={{ color: "#FFB400", fontSize: 18 }} />
                <Typography variant="caption" fontWeight="900">{product.ratingsAverage}</Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product._id);
              }}
              sx={{
                borderRadius: "14px",
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: '0.95rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                "&:hover": { transform: "translateY(-2px)", boxShadow: theme.shadows[10] }
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>

        <IconButton
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
            backgroundColor: theme.palette.mode === 'dark' ? "rgba(15, 23, 42, 0.7)" : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            color: isWishlisted ? theme.palette.error.main : theme.palette.text.secondary,
            boxShadow: theme.shadows[2],
            "&:hover": {
              backgroundColor: isWishlisted ? theme.palette.error.main : theme.palette.primary.main,
              color: "#fff",
              transform: "scale(1.1)"
            },
            transition: "all 0.3s ease"
          }}
          onClick={(e) => onWishlistToggle(e, product._id)}
        >
          <Favorite fontSize="small" />
        </IconButton>
      </Card>
    </motion.div>
  );
});

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishListItemId, removeFromWishlist } = useContext(WishlistContext);

  const getProducts = async () => {
    const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/products");
    return data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addCart = useCallback(async (productId) => {
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
  }, [addToCart, showToast]);

  const handleWishlistToggle = useCallback(async (e, productId) => {
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
  }, [wishListItemId, removeFromWishlist, addToWishlist, showToast]);

  const handleNavigate = useCallback((id) => navigate("/details/" + id), [navigate]);

  if (isLoading) return <ProductSkeleton />;

  if (isError) return (
    <Box sx={{ p: 10, textAlign: "center" }}>
      <Typography variant="h5" color="error">Error loading products: {error.message}</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      <PageMeta title="Shop Products" description="Discover premium products at best prices." />

      <Box sx={{ pt: 8, pb: 4, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>
          Premium <Box component="span" sx={{ color: "primary.main" }}>Catalog</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Handpicked items tailored for your lifestyle
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 4
        }}>
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
