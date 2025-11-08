import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import * as jwt_decode from "jwt-decode"; 
import { motion } from "framer-motion"; // For animations
import PageMeta from "../../components/PageMeta/PageMeta"; // For SEO/meta tags
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Divider 
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Loading from "../../components/Loading/Loading"; // Loading spinner component

export default function AllOrders() {
  const theme = useTheme(); // Get the current MUI theme (light/dark)

  // State to store the user ID extracted from JWT token
  const [userId, setUserId] = useState(null);
  
  // Get JWT token from localStorage
  const token = localStorage.getItem("userToken");

  // Decode the token and get user ID when the component mounts
  useEffect(() => {
    if (token) {
      const decoded = jwt_decode.jwtDecode(token);
      setUserId(decoded._id || decoded.id);
    }
  }, [token]);

  // Fetch the user's orders using react-query
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["orders", userId], // Include userId in query key
    queryFn: async () => {
      if (!userId) return []; // Return empty array if userId is not ready
      const res = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // Return orders data
    },
    enabled: !!userId, // Run query only if userId exists
  });

  // Show loading spinner while fetching data
  if (isLoading) return <Box sx={{ p: 3 }}> <Loading /></Box>;

  // Show error message if fetching fails
  if (isError) return <Typography sx={{ p: 3, color: theme.palette.error.main }}>Error fetching orders.</Typography>;

  const ordersList = orders || []; // Ensure we have an array to map over

  return (
    <>
      {/* SEO Meta tags */}
      <PageMeta
        key={"All Orders"}
        title="All Orders"
        description="View all your previous and current orders in one place."
      />

      {/* Main container */}
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", mx: "auto" }}>
        {/* Page title */}
        <Typography 
          variant="h4" 
          gutterBottom 
          color={theme.palette.text.primary} 
          fontWeight={700} 
          textAlign="center"
        >
          My Orders
        </Typography>

        {/* If no orders, show message */}
        {ordersList.length === 0 ? (
          <Typography 
            textAlign="center" 
            sx={{ mt: 5, color: theme.palette.text.secondary }}
          >
            No orders found.
          </Typography>
        ) : (
          // List of orders
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {ordersList.map(order => (
              // Animate each order card
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }} // Start hidden and below
                animate={{ opacity: 1, y: 0 }} // Animate to visible
                transition={{ duration: 0.5 }}
              >
                <Card 
                  sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" }, // Responsive layout
                    p: 2, 
                    borderRadius: 3, 
                    boxShadow: 3,
                    background: theme.palette.background.paper, // Background color based on theme
                    color: theme.palette.text.primary, // Text color based on theme
                  }}
                  component={motion.div} 
                  whileHover={{ scale: 1.02 }} 
                >
                  <Box sx={{ flex: 1 }}>
                    <CardContent>
                      {/* Order ID */}
                      <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary }}>
                        Order ID: {order._id}
                      </Typography>
                      <Divider sx={{ mb: 1, borderColor: theme.palette.divider }} />

                      {/* Order details */}
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        Total Price: ${order.totalOrderPrice}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        Payment: {order.paymentMethodType} - {order.isPaid ? "Paid" : "Not Paid"}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        Delivery: {order.isDelivered ? "Delivered" : "Pending"}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        Shipping: {order.shippingAddress.city}, {order.shippingAddress.phone}
                      </Typography>

                      {/* Products in the order */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                          Products:
                        </Typography>
                        {order.cartItems.map(item => (
                          // Animate each product
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
                              {/* Product image */}
                              <CardMedia
                                component="img"
                                image={item.product.imageCover}
                                alt={item.product.title}
                                sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
                              />
                              <Box>
                                {/* Product title and quantity */}
                                <Typography sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                                  {item.product.title}
                                </Typography>
                                <Chip 
                                  label={`Qty: ${item.count}`} 
                                  size="small" 
                                  color="primary" 
                                  sx={{ mt: 0.5 }} 
                                />
                              </Box>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
