import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import * as jwt_decode from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import PageMeta from "../../components/PageMeta/PageMeta";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Divider,
  Alert,
  Container,
  Collapse,
  IconButton,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ReceiptLong,
  LocalShipping,
  Payments,
  CalendarMonth,
  Inventory2
} from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";

export default function AllOrders() {
  const theme = useTheme();
  const [userId, setUserId] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        setUserId(decoded._id || decoded.id);
      } catch (error) {
        // Silently fail decoding
      }
    }
  }, [token]);

  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        { headers: { token } }
      );

      let orders = [];
      if (Array.isArray(res.data)) {
        orders = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        orders = res.data.data;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        orders = res.data.results;
      }
      return orders;
    },
    enabled: !!userId,
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          <strong>Error loading orders:</strong> {error?.message || "Unknown error"}
        </Alert>
      </Container>
    );
  }

  const ordersList = Array.isArray(ordersData) ? ordersData : [];

  if (ordersList.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <PageMeta title="My Orders" description="View your order history." />
        <Inventory2 sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h4" fontWeight="900" gutterBottom>No Orders Found</Typography>
        <Typography variant="body1" color="text.secondary">You haven't placed any orders yet. Start shopping to see them here!</Typography>
      </Container>
    );
  }

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      <PageMeta title="My Orders" description="View all your previous and current orders in one place." />

      <Box sx={{ pt: 10, pb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="1000" sx={{ mb: 1, letterSpacing: -1.5 }}>
          Order <Box component="span" sx={{ color: "primary.main" }}>History</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your {ordersList.length} premium purchases
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <Stack spacing={4}>
          <AnimatePresence>
            {ordersList.map((order, idx) => {
              const isExpanded = expandedRows[order._id];
              const cartItems = Array.isArray(order?.cartItems) ? order.cartItems : [];

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: "24px",
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      overflow: "hidden",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)"
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <Box sx={{ p: 1, bgcolor: 'primary.transparent', borderRadius: '12px', color: 'primary.main', display: 'flex' }}>
                              <ReceiptLong />
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
                                Order #{order._id?.slice(-8).toUpperCase()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarMonth sx={{ fontSize: 14 }} />
                                {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                            <Chip
                              icon={<Payments sx={{ fontSize: '1rem !important' }} />}
                              label={order.isPaid ? "Paid" : "Pending Payment"}
                              color={order.isPaid ? "success" : "warning"}
                              sx={{ fontWeight: 800, borderRadius: '10px' }}
                            />
                            <Chip
                              icon={<LocalShipping sx={{ fontSize: '1rem !important' }} />}
                              label={order.isDelivered ? "Delivered" : "Processing"}
                              color={order.isDelivered ? "success" : "info"}
                              sx={{ fontWeight: 800, borderRadius: '10px' }}
                            />
                            <IconButton
                              onClick={() => toggleRowExpansion(order._id)}
                              sx={{
                                bgcolor: 'action.hover',
                                transition: '0.3s',
                                transform: isExpanded ? 'rotate(180deg)' : 'none'
                              }}
                            >
                              <KeyboardArrowDown />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, opacity: 0.5 }} />

                      <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                            Total Price
                          </Typography>
                          <Typography variant="h5" fontWeight="1000" color="primary.main">
                            ${order.totalOrderPrice?.toFixed(2)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '16px', border: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>
                              Shipping to
                            </Typography>
                            <Typography variant="body2" fontWeight="700">
                              {order.shippingAddress?.details}, {order.shippingAddress?.city}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              📞 {order.shippingAddress?.phone}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 4, pt: 0, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}>
                        <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 3 }}>Order Items ({cartItems.length})</Typography>
                        <Grid container spacing={2}>
                          {cartItems.map((item, i) => (
                            <Grid item xs={12} key={item._id || i}>
                              <Card elevation={0} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 1.5,
                                borderRadius: '16px',
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: 'background.paper'
                              }}>
                                <CardMedia
                                  component="img"
                                  image={item.product?.imageCover}
                                  alt={item.product?.title}
                                  sx={{ width: 60, height: 60, borderRadius: '10px', objectFit: 'cover' }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="800">{item.product?.title}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Qty: {item.count} • ${item.price} each
                                  </Typography>
                                </Box>
                                <Typography variant="subtitle2" fontWeight="900" color="primary">
                                  ${(item.count * item.price).toFixed(2)}
                                </Typography>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Collapse>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Stack>
      </Container>
    </Box>
  );
}
