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
import CategoriesSlider from "../../components/CategoriesSlider/CategoriesSlider";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";

const cardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (delay) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
  hover: {
    scale: 1.02,
    boxShadow:
      "0 15px 45px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.08)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
    borderRadius: 10,
  },
};

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const addCart = async (productId) => {
    try {
      const data = await addToCart(productId);

      if (data?.status === "success") {
        setSnackbar({
          open: true,
          message: data.message || "Product added successfully to your cart",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data?.message || "Failed to add product to your cart",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Server error. Please try again later.",
        severity: "error",
      });
    }
  };

  const getProducts = async () => {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/products"
    );
    return data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );

  return (
    <>
      <CategoriesSlider />
      <Box sx={{ p: 4, backgroundColor: "#fafafa" }}>
        <Typography color="primary" variant="h4" fontWeight="bold" mb={3}>
          Products
        </Typography>

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
              <Card
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 3,
                  boxShadow:
                    "0 6px 15px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                  backgroundColor: "white",
                }}
                onClick={() => navigate("/details/" + product._id)}
              >
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
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {product.title.split(" ").slice(0, 3).join(" ")}
                    </Typography>
                    <Typography color="text.secondary" fontSize={14} mt={0.5}>
                      {product.description?.slice(0, 80)}...
                    </Typography>
                  </Box>

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
                      <Typography variant="h6">{product.ratingsAverage}</Typography>
                    </Box>
                  </Box>

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
                        background:
                          "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                        boxShadow: "0 6px 20px rgba(25,118,210,0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addCart(product._id);
                      }}
                    >
                      Add To Cart
                    </Button>
                  </Box>
                </CardContent>

                {/* Wishlist Icon */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "white",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await addToWishlist(product._id);
                      setSnackbar({
                        open: true,
                        message: "Added to wishlist",
                        severity: "success",
                      });
                    } catch (error) {
                      setSnackbar({
                        open: true,
                        message: "Failed to add to wishlist",
                        severity: "error",
                      });
                    }
                  }}
                >
                  <Favorite />
                </IconButton>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Snackbar / Alert */}
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
              snackbar.severity === "success" ? "#43a047" : "#e53935",
            color: "white",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
