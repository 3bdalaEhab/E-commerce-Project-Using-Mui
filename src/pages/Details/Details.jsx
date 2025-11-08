import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Chip,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "../../components/Loading/Loading";
import { CartContext } from "../../Context/CartContext";
import PageMeta from "../../components/PageMeta/PageMeta";

export default function Details() {
  const { id } = useParams();
  const theme = useTheme();
  const { addToCart } = useContext(CartContext);

  const getDetails = async () => {
    const { data } = await axios.get(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`
    );
    return data.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: getDetails,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  async function addCart() {
    try {
      setLoading(true);
      const data = await addToCart(id);

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
    } catch {
      setSnackbar({
        open: true,
        message: "Server error. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" fontWeight="bold">
          Error: {error.message}
        </Typography>
      </Box>
    );

  const allImages = [data.imageCover, ...(data.images || [])];

  return (
    <>
      <PageMeta
        key={"Product Details"}
        title="Product Details"
        description="Detailed information about the selected product"
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 3, md: 6 },
          px: { xs: 2, sm: 4 },
          minHeight: "100vh",
          background:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Box
          component={motion.div}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 5 },
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 25px rgba(255,255,255,0.08)"
                : "0 10px 35px rgba(0,0,0,0.1)",
            overflow: "hidden",
            maxWidth: 1000,
            width: "100%",
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* 🖼️ Slider */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              minWidth: { xs: "100%", md: "45%" },
            }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500 }}
              loop
              style={{ borderRadius: "16px" }}
            >
              {allImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <motion.img
                    src={img}
                    alt={`Product image ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "450px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      cursor: "grab",
                      backgroundColor: theme.palette.background.default,
                    }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* 📋 Product Details */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: { xs: "center", md: "left" },
              p: { xs: 1, sm: 2 },
              color: theme.palette.text.primary,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: theme.palette.primary.main }}
            >
              {data.title}
            </Typography>

            <Divider
              sx={{
                mb: 2,
                mx: { xs: "auto", md: 0 },
                width: "70px",
                borderBottomWidth: 3,
                borderColor: theme.palette.primary.main,
              }}
            />

            <Typography
              variant="body1"
              sx={{ mb: 3, lineHeight: 1.7, color: theme.palette.text.secondary }}
            >
              {data.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Chip
                label={data.category.name}
                color="primary"
                variant={
                  theme.palette.mode === "dark" ? "filled" : "outlined"
                }
                sx={{ fontWeight: "bold" }}
              />
              {data.brand?.name && (
                <Chip
                  label={data.brand.name}
                  color="secondary"
                  variant={
                    theme.palette.mode === "dark" ? "filled" : "outlined"
                  }
                  sx={{ fontWeight: "bold" }}
                />
              )}
            </Box>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 2,
                color:theme.palette.primary.main
                
              }}
            >
              💰 ${data.price}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <Rating
                value={data.ratingsAverage}
                precision={0.1}
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: theme.palette.warning.main,
                  },
                }}
              />
              <Typography variant="body1">
                {data.ratingsAverage.toFixed(1)} / 5
              </Typography>
            </Box>

            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                startIcon={<ShoppingCartIcon />}
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  px: 5,
                  py: 1.3,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "12px",
                  background: loading
                    ? "gray"
                    : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: theme.palette.getContrastText(
                    theme.palette.primary.main
                  ),
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 20px rgba(255,255,255,0.1)"
                      : "0 6px 20px rgba(25,118,210,0.3)",
                  "&:hover": {
                    background: loading
                      ? "gray"
                      : `linear-gradient(90deg, ${
                          theme.palette.primary.dark
                        } 0%, ${theme.palette.secondary.dark} 100%)`,
                  },
                }}
                onClick={addCart}
              >
                {loading ? "Loading..." : "Add to Cart"}
              </Button>
            </Box>

            {/* Snackbar */}
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
                  color: theme.palette.getContrastText(
                    theme.palette.error.main
                  ),
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    </>
  );
}
