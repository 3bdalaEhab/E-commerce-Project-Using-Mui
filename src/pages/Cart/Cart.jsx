import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import Loading from "../../components/Loading/Loading";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PageMeta from "../../components/PageMeta/PageMeta";

export default function Cart() {
  const { getCart, removeSpecificItem, removeAllItems, updateItem } =
    useContext(CartContext);
  const theme = useTheme();

  // State for cart data
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for toast messages
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Function to show toast message
  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  // Function to update item quantity
  async function updateQuantity(productId, newCount) {
    try {
      const res = await updateItem({ id: productId, count: newCount });
      if (res.status === "success") {
        fetchCart(); // Refresh cart
        showToast("Quantity updated successfully!", "success");
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to update quantity", "error");
    }
  }

  // Fetch cart data from context
  async function fetchCart() {
    try {
      const { data } = await getCart();
      setCart(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      showToast("Failed to load cart", "error");
    }
  }

  // Remove a specific item from cart
  async function removeItem(id) {
    try {
      const { data } = await removeSpecificItem(id);
      setCart(data);
      showToast("Item removed successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to remove item", "error");
    }
  }

  // Remove all items from cart
  async function handleClearAll() {
    try {
      const res = await removeAllItems();
      if (res.message === "success") {
        setCart(null);
        showToast("All items removed successfully!", "success");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to remove all items", "error");
    }
  }

  // Fetch cart when component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  // Show loading spinner
  if (loading)
    return (
      <Typography variant="h5" textAlign="center" color="primary" mt={10}>
        <PageMeta title="My Cart" description="Review the products in your shopping cart" />
        <Loading />
      </Typography>
    );

  // Show empty cart message
  if (!cart || cart.products.length === 0)
    return (
      <>
        <PageMeta title="My Cart" description="Review the products in your shopping cart" />
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            textAlign: "center",
            background: theme.palette.background.default,
            borderRadius: 3,
            px: 2,
            color: theme.palette.text.primary,
          }}
        >
          <RemoveShoppingCartIcon
            sx={{ fontSize: 90, color: theme.palette.primary.main, mb: 2 }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            color={theme.palette.text.primary}
            gutterBottom
          >
            Your cart is empty
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.text.secondary}
            sx={{ maxWidth: 400, mb: 4 }}
          >
            Looks like you haven’t added anything yet. Start exploring our
            products and add your favorite items to the cart.
          </Typography>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              startIcon={<ShoppingBagIcon />}
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.2,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                boxShadow: `0 6px 20px ${
                  theme.palette.mode === "light"
                    ? "rgba(25,118,210,0.3)"
                    : "rgba(255,255,255,0.2)"
                }`,
              }}
            >
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </>
    );

  // Main cart display
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          px: { xs: 1, sm: 3, md: 5 },
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #f5f7fa 0%, #aac7f79c 100%)"
              : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            maxWidth: 950,
            mx: "auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 10px 35px rgba(0,0,0,0.15)"
                : "0 10px 35px rgba(255,255,255,0.08)",
            p: { xs: 2, sm: 4 },
            color: theme.palette.text.primary,
          }}
        >
          {/* Cart title */}
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color={theme.palette.text.primary}
            mb={3}
          >
            🛒 Your Shopping Cart
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Total price and remove all button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap"
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              Total Price:{" "}
              <Typography
                component="span"
                color="primary.main"
                fontWeight="medium"
              >
                {cart.totalCartPrice} EGP
              </Typography>
            </Typography>

            <Button
              variant="outlined"
              color="error"
              onClick={handleClearAll}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: "bold",
                transition:"0.5s",
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.main,
                  color: "#fff",
                },
              }}
            >
              Remove All
            </Button>
          </Box>

          {/* Cart items */}
          <Grid container spacing={3}>
            {cart.products.map((item) => (
              <Grid item width={"100%"} xs={12} key={item._id}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 6px 25px rgba(0,0,0,0.1)"
                        : "0 6px 25px rgba(255,255,255,0.08)",
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                >
                  {/* Product image */}
                  <CardMedia
                    component="img"
                    image={item.product.imageCover}
                    alt={item.product.title}
                    sx={{
                      width: { xs: "100%", sm: 250 },
                      height: { xs: 150, sm: 180 },
                      objectFit: "cover",
                    }}
                  />

                  {/* Product details */}
                  <CardContent
                    sx={{
                      flex: 1,
                      p: { xs: 2, sm: 3 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {/* Product title */}
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {item.product.title.split(" ").slice(0, 6).join(" ")}
                      </Typography>

                      {/* Category and brand chips */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: { xs: "center", md: "flex-start" },
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1.5,
                          my: 2,
                        }}
                      >
                        <Chip
                          label={item.product.category.name}
                          color="primary"
                          variant={theme.palette.mode === "dark" ? "filled" : "outlined"}
                          sx={{ fontWeight: "bold" }}
                        />
                        {item.product.brand?.name && (
                          <Chip
                            label={item.product.brand.name}
                            color="secondary"
                            variant={theme.palette.mode === "dark" ? "filled" : "outlined"}
                            sx={{ fontWeight: "bold" }}
                          />
                        )}
                      </Box>

                      {/* Product price */}
                      <Typography
                        color={theme.palette.primary.main}
                        fontWeight="bold"
                        mt={2}
                      >
                        💰 {item.price} EGP
                      </Typography>
                    </Box>

                    {/* Quantity controls and remove button */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Box display="flex" alignItems="center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            updateQuantity(item.product.id, item.count + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>

                        <Typography
                          sx={{
                            mx: 1,
                            minWidth: 25,
                            textAlign: "center",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {item.count}
                        </Typography>

                        <IconButton
                          color="primary"
                          onClick={() =>
                            item.count > 1
                              ? updateQuantity(item.product.id, item.count - 1)
                              : removeItem(item.product.id)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>

                      <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        onClick={() => removeItem(item.product.id)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          fontWeight: "bold",
                          transition:"0.5s",
                          borderColor: theme.palette.error.main,
                          color: theme.palette.error.main,
                          "&:hover": {
                            backgroundColor: theme.palette.error.main,
                            color: "#fff",
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Checkout button */}
          <Box textAlign="center" mt={5}>
            <Link to={`/checkout/${cart._id}`}>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                startIcon={<ShoppingCartCheckoutIcon />}
                variant="contained"
                size="large"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  px: 6,
                  py: 1.3,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  boxShadow: `0 6px 20px ${
                    theme.palette.mode === "light"
                      ? "rgba(25,118,210,0.3)"
                      : "rgba(255,255,255,0.2)"
                  }`,
                }}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Toast notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
