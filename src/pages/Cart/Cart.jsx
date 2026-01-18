import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Divider,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { useToast } from "../../Context/ToastContext";
import { CartSkeleton } from "../../components/Common/Skeletons";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PageMeta from "../../components/PageMeta/PageMeta";

// 🔹 Memoized Cart Item Component
const CartItem = React.memo(({ item, onUpdateQuantity, onRemove, theme }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          borderRadius: "24px",
          overflow: "hidden",
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.palette.mode === 'dark' ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.05)"
          },
        }}
      >
        <CardMedia
          component="img"
          image={item.product.imageCover}
          alt={item.product.title}
          sx={{ width: { xs: "100%", sm: 200 }, height: { xs: 180, sm: "auto" }, objectFit: "cover" }}
        />
        <CardContent sx={{ flex: 1, p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="900" sx={{ mb: 1, letterSpacing: '-0.5px' }}>
                {item.product.title.split(" ").slice(0, 5).join(" ")}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Chip label={item.product.category.name} size="small" variant="outlined" color="primary"
                  sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.7rem' }} />
                {item.product.brand && <Chip label={item.product.brand.name} size="small" variant="outlined"
                  sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.7rem' }} />}
              </Box>
            </Box>
            <Typography variant="h5" color="primary" fontWeight="900">
              {item.price} <Box component="span" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>EGP</Box>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: theme.palette.action.hover,
              borderRadius: "12px",
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.product.id, item.count - 1)}
                disabled={item.count <= 1}
                sx={{ borderRadius: '10px' }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ mx: 2, fontWeight: "900", minWidth: '20px', textAlign: 'center' }}>{item.count}</Typography>
              <IconButton
                size="small"
                onClick={() => onUpdateQuantity(item.product.id, item.count + 1)}
                sx={{ borderRadius: '10px' }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => onRemove(item.product.id)}
              sx={{
                textTransform: "none",
                fontWeight: "900",
                borderRadius: '12px',
                "&:hover": { bgcolor: 'error.lighter' }
              }}
            >
              Remove
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default function Cart() {
  const { getCart, removeSpecificItem, removeAllItems, updateItem } = useContext(CartContext);
  const theme = useTheme();
  const { showToast } = useToast();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (error) {
      showToast("❌ Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  }, [getCart, showToast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (productId, newCount) => {
    try {
      const res = await updateItem({ id: productId, count: newCount });
      if (res.status === "success") {
        setCart(res.data);
        showToast("✅ Quantity updated", "success");
      }
    } catch (err) {
      showToast("❌ Update failed", "error");
    }
  }, [updateItem, showToast]);

  const removeItem = useCallback(async (id) => {
    try {
      const { data } = await removeSpecificItem(id);
      setCart(data);
      showToast("🗑️ Item removed", "success");
    } catch (error) {
      showToast("❌ Removal failed", "error");
    }
  }, [removeSpecificItem, showToast]);

  const handleClearAll = useCallback(async () => {
    try {
      const res = await removeAllItems();
      if (res.message === "success") {
        setCart(null);
        showToast("🧹 Cart cleared", "success");
      }
    } catch (error) {
      showToast("❌ Clear failed", "error");
    }
  }, [removeAllItems, showToast]);

  if (loading) return <CartSkeleton />;

  if (!cart || cart.products.length === 0) return (
    <Box sx={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", px: 2
    }}>
      <PageMeta title="My Cart" description="Your shopping cart is currently empty." />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <RemoveShoppingCartIcon sx={{ fontSize: 100, color: "text.disabled", mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>Empty Cart</Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          Your basket feels a bit light. Let's add some premium products!
        </Typography>
        <Button component={Link} to="/" variant="contained" size="large" sx={{ borderRadius: "12px", px: 4 }}>
          Start Shopping
        </Button>
      </motion.div>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
      <PageMeta title="My Cart" description="Review and checkout your items." />

      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" sx={{ mb: 1 }}>Cart</Typography>
            <Typography variant="body1" color="text.secondary">Review your selection</Typography>
          </Box>
          <Button variant="outlined" color="error" onClick={handleClearAll} sx={{ borderRadius: "10px" }}>
            Clear All
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <AnimatePresence>
              {cart.products.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  theme={theme}
                />
              ))}
            </AnimatePresence>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: "24px",
                position: "sticky",
                top: 100,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === 'dark' ? "0 20px 50px rgba(0,0,0,0.5)" : "0 20px 50px rgba(0,0,0,0.05)"
              }}
            >
              <Typography variant="h5" fontWeight="900" sx={{ mb: 3, letterSpacing: '-1px' }}>Order Summary</Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary" fontWeight="500">Products count</Typography>
                  <Typography fontWeight="900" variant="body1">{cart.products.length}</Typography>
                </Box>
                <Divider sx={{ opacity: 0.6 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="900">Total Amount</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" fontWeight="1000" color="primary.main" sx={{ lineHeight: 1 }}>
                      {cart.totalCartPrice}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="700">EGP (Incl. VAT)</Typography>
                  </Box>
                </Box>

                <Button
                  component={Link}
                  to={`/checkout/${cart._id}`}
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartCheckoutIcon />}
                  sx={{
                    mt: 2,
                    py: 2,
                    borderRadius: "14px",
                    fontWeight: "900",
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    "&:hover": { transform: "translateY(-3px)", boxShadow: theme.shadows[12] }
                  }}
                >
                  Checkout Securely
                </Button>

                <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 1 }}>
                  🔒 Secure transaction via SSL
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
