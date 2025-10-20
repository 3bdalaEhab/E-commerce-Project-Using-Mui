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

export default function Cart() {
  const { getCart, removeSpecificItem, removeAllItems, updateItem } =
    useContext(CartContext);

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  // 🧩 Update quantity
  async function updateQuantity(productId, newCount) {
    try {
      const res = await updateItem({ id: productId, count: newCount });
      if (res.status === "success") {
        fetchCart();
        showToast("Quantity updated successfully!", "success");
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to update quantity", "error");
    }
  }

  // 🧩 Fetch Cart Data
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

  // 🧩 Remove Item
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

  // 🧩 Remove All
  async function handleClearAll() {
    try {
      const res = await removeAllItems();
      if (res.message === "success") {
        setCart(null);
        showToast("All items removed successfully!", "success");
      }
    } catch (error) {
      console.log(error)
      showToast("Failed to remove all items", "error");
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <Typography variant="h5" textAlign="center" color="primary" mt={10}>
        <Loading />
      </Typography>
    );

  if (!cart || cart.products.length === 0)
    return (
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
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 3,
          px: 2,
        }}
      >
        <RemoveShoppingCartIcon
          sx={{ fontSize: 90, color: "primary.main", mb: 2 }}
        />
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.dark"
          gutterBottom
        >
          Your cart is empty
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
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
              background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
              boxShadow: "0 6px 20px rgba(25,118,210,0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                boxShadow: "0 8px 25px rgba(25,118,210,0.4)",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </Box>
    );

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          px: { xs: 1, sm: 3, md: 5 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #aac7f79c 100%)",
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
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
            p: { xs: 2, sm: 4 },
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="primary"
            mb={3}
          >
            🛒 Your Shopping Cart
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap"
          >
            <Typography variant="h6" color="primary.dark">
              Total Price:{" "}
              <Typography component="span" color="black" fontWeight="medium">
                {cart.totalCartPrice} EGP
              </Typography>
            </Typography>

            <Button
              variant="outlined"
              color="error"
              onClick={handleClearAll}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Remove All
            </Button>
          </Box>

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
                    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                    background: "#fafafa",
                    width: "100%",
                  }}
                >
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
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary.dark"
                      >
                        {item.product.title.split(" ").slice(0, 6).join(" ")}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={item.product.category.name}
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            px: 1.5,
                            borderRadius: "8px",
                            mr: 1,
                            mb: 1,
                          }}
                        />
                        {item.product.brand?.name && (
                          <Chip
                            label={item.product.brand.name}
                            color="secondary"
                            variant="outlined"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.8rem",
                              px: 1.5,
                              borderRadius: "8px",
                              mb: 1,
                            }}
                          />
                        )}
                      </Box>

                      <Typography color="primary" fontWeight="bold" mt={2}>
                        💰 {item.price} EGP
                      </Typography>
                    </Box>

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
                          sx={{ mx: 1, minWidth: 25, textAlign: "center" }}
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
                        color="error"
                        onClick={() => removeItem(item.product.id)}
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

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
                  px: 6,
                  py: 1.3,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: "0 6px 20px rgba(25,118,210,0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                    boxShadow: "0 8px 25px rgba(25,118,210,0.4)",
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* ✅ Toast */}
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
