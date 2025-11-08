import React, { useContext, useState } from "react";
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
  Snackbar,
  Button,
  Alert,
} from "@mui/material";
import { Star, Favorite } from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useTheme } from "@mui/material/styles";

// 🔹 Animation variants for product cards
const cardVariants = {
  hidden: { opacity: 0, x: -50 }, // initial hidden state
  visible: (delay) => ({ // visible state with optional delay
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
  hover: { // hover animation
    scale: 1.02,
    boxShadow: "0 15px 45px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
    borderRadius: 10,
  },
};

export default function Products() {
  const navigate = useNavigate();

  // 🔹 Contexts for cart and wishlist
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, wishListItemId, removeFromWishlist } =
    useContext(WishlistContext);
  const theme = useTheme();

  // 🔹 Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔹 Fetch products from API
  const getProducts = async () => {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/products"
    );
    return data.data;
  };

  // 🔹 useQuery to fetch and cache products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // 🔹 Add product to cart with notification
  const addCart = async (productId) => {
    try {
      const data = await addToCart(productId);
      if (data?.status === "success") {
        setSnackbar({
          open: true,
          message: "Product added to cart successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to add product to cart",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Server error. Please try again later.",
        severity: "error",
      });
    }
  };

  // 🔹 Toggle wishlist status
  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation(); // prevent card click navigation
    try {
      if (wishListItemId.includes(productId)) {
        await removeFromWishlist(productId);
        setSnackbar({
          open: true,
          message: "Removed from wishlist",
          severity: "error",
        });
      } else {
        await addToWishlist(productId);
        setSnackbar({
          open: true,
          message: "Added to wishlist",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update wishlist",
        severity: "error",
      });
    }
  };

  // 🔹 Loading state
  if (isLoading) return <Loading />;

  // 🔹 Error state
  if (isError)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );

  return (
    <>
      {/* 🔹 Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          p: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>
      </Box>

      {/* 🔹 Product grid container */}
      <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {data.map((product, index) => (
            <motion.div
              key={product._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              custom={(index % 4) * 0.1}
              viewport={{ once: true, amount: 0.3 }}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* 🔹 Product card */}
              <Card
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 6px 15px rgba(0,0,0,0.08)"
                      : "0 6px 15px rgba(255,255,255,0.05)",
                  position: "relative",
                }}
                onClick={() => navigate("/details/" + product._id)}
              >
                {/* 🔹 Product image */}
                <CardMedia
                  component="img"
                  image={product.imageCover}
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />

                {/* 🔹 Card content */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    {/* 🔹 Product title */}
                    <Typography variant="h6">
                      {product.title.split(" ").slice(0, 3).join(" ")}
                    </Typography>
                    {/* 🔹 Product description */}
                    <Typography
                      color={theme.palette.text.secondary}
                      fontSize={14}
                      mt={0.5}
                    >
                      {product.description?.slice(0, 80)}...
                    </Typography>
                  </Box>

                  {/* 🔹 Price and ratings */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Typography variant="h6">${product.price}</Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Star sx={{ color: "#eebe22ff", fontSize: "30px" }} />
                      <Typography variant="h6">
                        {product.ratingsAverage}
                      </Typography>
                    </Box>
                  </Box>

                  {/* 🔹 Add to cart button */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      endIcon={<ShoppingCartIcon />}
                      variant="contained"
                      size="small"
                      sx={{
                        px: 5,
                        py: 1.3,
                        fontSize: "1rem",
                        textTransform: "none",
                        borderRadius: "12px",
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                        "&:hover": { opacity: 0.9 },
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        addCart(product._id);
                      }}
                    >
                      Add To Cart
                    </Button>
                  </Box>
                </CardContent>

                {/* 🔹 Wishlist button */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: theme.palette.background.paper,
                    color: wishListItemId.includes(product._id)
                      ? theme.palette.error.main
                      : theme.palette.text.secondary,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onClick={(e) => handleWishlistToggle(e, product._id)}
                >
                  <Favorite />
                </IconButton>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* 🔹 Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor:
              snackbar.severity === "success"
                ? theme.palette.success.main
                : theme.palette.error.main,
            color: "#fff",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
