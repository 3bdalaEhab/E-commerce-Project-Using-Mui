import React, { useContext, useEffect, useCallback } from "react";
import { WishlistContext } from "../../Context/WishlistContext";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  IconButton,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { WishlistSkeleton } from "../../components/Common/Skeletons";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useToast } from "../../Context/ToastContext";

// 🔹 Memoized Wishlist Item Component
const WishlistItem = React.memo(({ item, onRemove, onNavigate, theme }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        onClick={() => onNavigate(item._id)}
        sx={{
          width: 300,
          borderRadius: "24px",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            transform: "translateY(-8px)",
            boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.08)"
          },
        }}
      >
        <Box sx={{ position: "relative", height: 240 }}>
          <CardMedia
            component="img"
            image={item.imageCover}
            alt={item.title}
            sx={{ height: '100%', objectFit: "cover" }}
          />
          <Box sx={{
            position: "absolute", top: 15, left: 15,
            bgcolor: "rgba(0,0,0,0.6)", color: "white",
            backdropFilter: 'blur(8px)',
            px: 1.5, py: 0.5, borderRadius: "8px", fontSize: "0.65rem", fontWeight: "900", letterSpacing: '1px'
          }}>
            FAVORITE
          </Box>
        </Box>

        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="900" noWrap sx={{ mb: 1, letterSpacing: '-0.5px' }}>
            {item.title}
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="1000" sx={{ mb: 3 }}>
            ${item.price}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={(e) => onRemove(e, item._id)}
            sx={{
              borderRadius: "14px",
              py: 1.2,
              textTransform: "none",
              fontWeight: "900",
              borderWidth: '2px',
              "&:hover": { borderWidth: '2px', bgcolor: 'error.main', color: 'white', transform: 'scale(1.02)' }
            }}
          >
            Remove
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading, getWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  const handleRemove = useCallback(async (e, id) => {
    e.stopPropagation();
    try {
      await removeFromWishlist(id);
      showToast("💔 Item removed from wishlist", "success");
    } catch {
      showToast("❌ Failed to remove item", "error");
    }
  }, [removeFromWishlist, showToast]);

  const handleNavigate = useCallback((id) => navigate(`/details/${id}`), [navigate]);

  if (loading) return <WishlistSkeleton />;

  if (!wishlist.length) return (
    <Box sx={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", px: 2
    }}>
      <PageMeta title="My Wishlist" description="Your wishlist is empty." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 100, color: "text.disabled", mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>Wishlist is Empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          Save items you love here and they'll be waiting for you when you're ready to buy!
        </Typography>
        <Button component={Link} to="/" variant="contained" size="large" sx={{ borderRadius: "12px", px: 4 }}>
          Explore Products
        </Button>
      </motion.div>
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

        <Grid container spacing={4} justifyContent="center">
          <AnimatePresence>
            {wishlist.map((item) => (
              <Grid item key={item._id}>
                <WishlistItem
                  item={item}
                  onRemove={handleRemove}
                  onNavigate={handleNavigate}
                  theme={theme}
                />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </Box>
  );
}
