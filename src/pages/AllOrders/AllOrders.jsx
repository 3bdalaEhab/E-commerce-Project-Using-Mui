import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import * as jwt_decode from "jwt-decode"; 
import { motion } from "framer-motion";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";

export default function AllOrders() {
  const theme = useTheme();

  const [userId, setUserId] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const token = localStorage.getItem("userToken");

  // ✅ فك تشفير التوكن
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        setUserId(decoded._id || decoded.id);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
      }
    }
  }, [token]);

  // ✅ جلب الطلبات
  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("📡 Full API Response:", res.data); // ✅ للـ debugging
      console.log("📡 Response Type:", typeof res.data); // ✅ نوع الاستجابة
      console.log("📡 Is Array:", Array.isArray(res.data)); // ✅ هل مصفوفة
      
      // ✅ الاستجابة قد تكون array مباشرة أو object بـ data/results
      let orders = [];
      if (Array.isArray(res.data)) {
        orders = res.data;
        console.log("✅ Orders from array:", orders);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        orders = res.data.data;
        console.log("✅ Orders from data:", orders);
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        orders = res.data.results;
        console.log("✅ Orders from results:", orders);
      } else {
        console.warn("⚠️ Unexpected response structure:", res.data);
      }
      
      // ✅ طباعة أول طلب لنشوف البيانات
      if (orders.length > 0) {
        console.log("📦 First Order Details:", orders[0]);
        console.log("📍 Shipping Address:", orders[0].shippingAddress);
      }
      
      console.log("✅ Processed orders:", orders); // ✅ للـ debugging
      return orders;
    },
    enabled: !!userId,
  });

  // ✅ معالجة التحميل
  if (isLoading) {
    return <Box sx={{ p: 3 }}><Loading /></Box>;
  }

  // ✅ معالجة الخطأ
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <strong>❌ Error loading orders:</strong> {error?.message || "Unknown error"}
        </Alert>
      </Container>
    );
  }

  const ordersList = Array.isArray(ordersData) ? ordersData : [];

  // ✅ معالجة الطلبات الفارغة
  if (ordersList.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PageMeta
          title="All Orders"
          description="View all your previous and current orders in one place."
        />
        <Alert severity="info">
          <strong>📦 No orders found.</strong> Start shopping to see your orders here.
        </Alert>
      </Container>
    );
  }

  // ✅ دالة التبديل للتوسيع
  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <>
      <PageMeta
        title="All Orders"
        description="View all your previous and current orders in one place."
      />

      <Container maxWidth="lg" sx={{ p: { xs: 2, sm: 3 }, my: 3 }}>
        {/* العنوان */}
        <Typography 
          variant="h4" 
          gutterBottom 
          color={theme.palette.text.primary} 
          fontWeight={700} 
          textAlign="center"
          sx={{ mb: 4 }}
        >
          📦 My Orders ({ordersList.length})
        </Typography>

        {/* قائمة الطلبات */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {ordersList.map((order) => {
            const isExpanded = expandedRows[order._id];
            const cartItems = Array.isArray(order?.cartItems) ? order.cartItems : [];

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card 
                  sx={{ 
                    p: 0,
                    borderRadius: 3, 
                    boxShadow: 3,
                    background: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  {/* رأس الطلب */}
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Order #{order._id?.slice(0, 8)}...
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                        </Typography>
                      </Box>

                      {/* زر التوسيع */}
                      <IconButton 
                        onClick={() => toggleRowExpansion(order._id)}
                        size="small"
                        sx={{ mt: -1 }}
                      >
                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* ملخص الطلب */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                      {/* السعر */}
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Total Price
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: "1.1rem" }}>
                          ${order.totalOrderPrice?.toFixed(2) || "0.00"}
                        </Typography>
                      </Box>

                      {/* الدفع */}
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Payment Status
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip 
                            label={order.isPaid ? "✅ Paid" : "⏳ Not Paid"} 
                            size="small" 
                            color={order.isPaid ? "success" : "warning"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>

                      {/* التسليم */}
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Delivery Status
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip 
                            label={order.isDelivered ? "✅ Delivered" : "🚚 Shipping"} 
                            size="small" 
                            color={order.isDelivered ? "success" : "info"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>

                      {/* المنتجات */}
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Items
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                          {cartItems.length} product(s)
                        </Typography>
                      </Box>
                    </Box>

                    {/* معلومات الشحن الملخصة */}
                    <Box sx={{ mt: 2, p: 1.5, backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", borderRadius: 2, borderLeft: `3px solid ${theme.palette.primary.main}` }}>
                      <Typography sx={{ color: theme.palette.text.primary, fontSize: "0.9rem", mb: 0.5 }}>
                        <strong>📍 Shipping Address:</strong>
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem", mb: 0.5 }}>
                        {order.shippingAddress?.details || "N/A"}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem", mb: 0.5 }}>
                        🏙️ {order.shippingAddress?.city || "N/A"}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}>
                        📞 {order.shippingAddress?.phone || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* التفاصيل المتوسعة */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Divider />
                    <CardContent>
                      {/* المنتجات */}
                      <Typography 
                        variant="subtitle1" 
                        sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}
                      >
                        📦 Products Details:
                      </Typography>

                      {cartItems.length > 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                          {cartItems.map((item, index) => (
                            <motion.div
                              key={item._id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                              <Box 
                                sx={{ 
                                  display: "flex", 
                                  gap: 2,
                                  p: 1.5,
                                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                                  borderRadius: 2,
                                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                                }}
                              >
                                {/* صورة المنتج */}
                                {item.product?.imageCover ? (
                                  <CardMedia
                                    component="img"
                                    image={item.product.imageCover}
                                    alt={item.product?.title || "Product"}
                                    sx={{ 
                                      width: 80, 
                                      height: 80, 
                                      objectFit: "cover", 
                                      borderRadius: 1,
                                      flexShrink: 0,
                                    }}
                                  />
                                ) : (
                                  <Box 
                                    sx={{ 
                                      width: 80, 
                                      height: 80, 
                                      backgroundColor: theme.palette.action.hover,
                                      borderRadius: 1,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Typography variant="caption">No image</Typography>
                                  </Box>
                                )}

                                {/* معلومات المنتج */}
                                <Box sx={{ flex: 1 }}>
                                  <Typography 
                                    sx={{ 
                                      fontWeight: 600, 
                                      color: theme.palette.text.primary,
                                      mb: 1,
                                    }}
                                  >
                                    {item.product?.title || "Product"}
                                  </Typography>
                                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <Chip 
                                      label={`Qty: ${item.count || 0}`} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                    <Chip 
                                      label={`$${item.price?.toFixed(2) || "0.00"}`} 
                                      size="small" 
                                      color="primary"
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </motion.div>
                          ))}
                        </Box>
                      ) : (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                          ⚠️ No items in this order
                        </Alert>
                      )}

                      {/* معلومات الشحن الكاملة */}
                      <Divider sx={{ my: 2 }} />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}
                      >
                        🏠 Shipping Details:
                      </Typography>
                      <Box sx={{ p: 1.5, backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", borderRadius: 2, borderLeft: `3px solid ${theme.palette.success.main}` }}>
                        <Typography sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                          <strong>📝 Details:</strong> {order.shippingAddress?.details || "N/A"}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                          <strong>🏙️ City:</strong> {order.shippingAddress?.city || "N/A"}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          <strong>📞 Phone:</strong> {order.shippingAddress?.phone || "N/A"}
                        </Typography>
                      </Box>

                      {/* معلومات المستخدم */}
                      <Divider sx={{ my: 2 }} />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 600 }}
                      >
                        👤 Customer Information:
                      </Typography>
                      <Box sx={{ p: 1.5, backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                        <Typography sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                          <strong>Name:</strong> {order.user?.name || "N/A"}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                          <strong>Email:</strong> {order.user?.email || "N/A"}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          <strong>Phone:</strong> {order.user?.phone || "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Collapse>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      </Container>
    </>
  );
}