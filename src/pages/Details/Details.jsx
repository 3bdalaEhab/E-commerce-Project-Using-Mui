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
  Stack,
  Container,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "../../components/Loading/Loading";
import { CartContext } from "../../Context/CartContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useToast } from "../../Context/ToastContext";

export default function Details() {
  const { id } = useParams();
  const theme = useTheme();
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

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

  async function addCart() {
    try {
      setLoading(true);
      const res = await addToCart(id);
      if (res?.status === "success") {
        showToast("✨ Product added to your premium collection!", "success");
      } else {
        showToast(res?.message || "Failed to add product.", "error");
      }
    } catch {
      showToast("❌ Connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ borderRadius: "16px" }}>
          <strong>Error loading product details:</strong> {error?.message}
        </Alert>
      </Container>
    );

  const allImages = [data.imageCover, ...(data.images || [])];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      <PageMeta title={data.title} description={data.description.slice(0, 160)} />

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 10 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "32px",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
            boxShadow: theme.palette.mode === 'dark' ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.05)",
          }}
        >
          <Grid container>
            {/* Image Gallery */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 4 }, borderRight: { md: `1px solid ${theme.palette.divider}` } }}>
              <Box sx={{ position: 'relative' }}>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000 }}
                  loop
                  style={{ borderRadius: "24px", overflow: 'hidden' }}
                >
                  {allImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Box sx={{ height: { xs: 350, md: 500 }, bgcolor: 'action.hover' }}>
                        <img
                          src={img}
                          alt={data.title}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Chip
                  label="PREMIUM"
                  sx={{ position: 'absolute', top: 20, left: 20, zIndex: 2, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)', fontWeight: 900, borderRadius: '8px' }}
                />
              </Box>
            </Grid>

            {/* Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 4, md: 6 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack spacing={2} mb={4}>
                  <Stack direction="row" spacing={1}>
                    <Chip label={data.category.name} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: '8px' }} />
                    {data.brand && <Chip label={data.brand.name} size="small" variant="outlined" sx={{ fontWeight: 800, borderRadius: '8px' }} />}
                  </Stack>
                  <Typography variant="h3" fontWeight="1000" sx={{ letterSpacing: -1.5, lineHeight: 1.1 }}>
                    {data.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={data.ratingsAverage} precision={0.1} readOnly sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight="700">({data.ratingsAverage.toFixed(1)} Rating)</Typography>
                  </Stack>
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, flex: 1 }}>
                  {data.description}
                </Typography>

                <Divider sx={{ mb: 4, opacity: 0.5 }} />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase' }}>Price</Typography>
                    <Typography variant="h3" fontWeight="1000" color="primary">
                      ${data.price}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={!loading && <ShoppingCartIcon />}
                      disabled={loading}
                      onClick={addCart}
                      sx={{
                        borderRadius: "14px",
                        py: 2,
                        fontWeight: "900",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        "&:hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[10] }
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Add to Cart"}
                    </Button>
                    <IconButton sx={{ bgcolor: 'action.hover', borderRadius: '14px', width: 60, height: 60 }}>
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
