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

export default function Details() {
  const { id } = useParams();
  const theme = useTheme();
  const { addToCart } = useContext(CartContext);

  // 🧩 جلب بيانات المنتج
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

  // 🛒 دالة إضافة المنتج مع توستر
  async function addCart() {
    try {
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Server error. Please try again later.",
        severity: "error",
      });
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
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
          backgroundColor: "#fff",
          borderRadius: 4,
          boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
          overflow: "hidden",
          maxWidth: 1000,
          width: "100%",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* 🖼️ السلايدر */}
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
            autoplay={{ delay: 2000 }}
            loop
            style={{
              borderRadius: "16px",
            }}
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
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* 📋 تفاصيل المنتج */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: { xs: "center", md: "left" },
            p: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: theme.palette.primary.dark }}
          >
            {data.title}
          </Typography>

          <Divider
            sx={{
              mb: 2,
              mx: { xs: "auto", md: 0 },
              width: "70px",
              borderBottomWidth: 3,
              borderColor: "primary.main",
            }}
          />

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.7 }}
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
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
            {data.brand?.name && (
              <Chip
                label={data.brand.name}
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              />
            )}
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "green" }}
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
            <Rating value={data.ratingsAverage} precision={0.1} readOnly />
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
              sx={{
                px: 5,
                py: 1.3,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                boxShadow: "0 6px 20px rgba(25,118,210,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                },
              }}
              onClick={addCart}
            >
              Add to Cart
            </Button>
          </Box>

          {/* 🧈 Snackbar في النص تحت */}
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
        </Box>
      </Box>
    </Box>
  );
}
