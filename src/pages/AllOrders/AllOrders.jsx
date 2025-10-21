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
import Loading from "../../components/Loading/Loading"; // Loading spinner component

export default function AllOrders() {
  // State to store the user ID extracted from the JWT token
  const [userId, setUserId] = useState(null);
  
  // Get the token from localStorage
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
    queryKey: ["orders", userId], // The query key includes the userId
    queryFn: async () => {
      if (!userId) return []; // If no userId yet, return empty array
      const res = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // Return the orders data from API
    },
    enabled: !!userId, // Only run the query if userId exists
  });

  // Show loading spinner while fetching
  if (isLoading) return <Box sx={{ p: 3 }}> <Loading /></Box>;
  
  // Show error message if fetching fails
  if (isError) return <Typography sx={{ p: 3 }}>Error fetching orders.</Typography>;

  // Ensure we have an array to map over
  const ordersList = orders || [];

  return (
    <>
      {/* SEO Meta tags */}
      <PageMeta
        key={"All Orders"}
        title="All Orders"
        description="View all your previous and current orders in one place."
      />

      {/* Container for the orders page */}
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", mx: "auto" }}>
        {/* Page title */}
        <Typography variant="h4" gutterBottom color="primary" fontWeight={700} textAlign="center">
          My Orders
        </Typography>

        {/* If no orders, display a message */}
        {ordersList.length === 0 ? (
          <Typography textAlign="center" sx={{ mt: 5 }}>No orders found.</Typography>
        ) : (
          // List of orders
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {ordersList.map(order => (
              // Animate each order card using Framer Motion
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }} // Start hidden and below
                animate={{ opacity: 1, y: 0 }} // Animate to visible
                transition={{ duration: 0.5 }} // Animation duration
              >
                <Card 
                  sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" }, // Responsive layout
                    p: 2, 
                    borderRadius: 3, 
                    boxShadow: 3 
                  }}
                  component={motion.div} // Enable motion on Card
                  whileHover={{ scale: 1.02 }} // Slight scale on hover
                >
                  <Box sx={{ flex: 1 }}>
                    <CardContent>
                      {/* Order ID */}
                      <Typography variant="h6" sx={{ mb: 1 }}>Order ID: {order._id}</Typography>
                      <Divider sx={{ mb: 1 }} />

                      {/* Order details */}
                      <Typography>Total Price: ${order.totalOrderPrice}</Typography>
                      <Typography>
                        Payment: {order.paymentMethodType} - {order.isPaid ? "Paid" : "Not Paid"}
                      </Typography>
                      <Typography>
                        Delivery: {order.isDelivered ? "Delivered" : "Pending"}
                      </Typography>
                      <Typography>
                        Shipping: {order.shippingAddress.city}, {order.shippingAddress.phone}
                      </Typography>

                      {/* Products in the order */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Products:</Typography>
                        {order.cartItems.map(item => (
                          // Animate each product individually
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, x: -20 }} // Start left and hidden
                            animate={{ opacity: 1, x: 0 }} // Animate into place
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Box 
                              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}
                            >
                              {/* Product image */}
                              <CardMedia
                                component="img"
                                image={item.product.imageCover}
                                alt={item.product.title}
                                sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
                              />
                              <Box>
                                {/* Product title and quantity */}
                                <Typography sx={{ fontWeight: 500 }}>{item.product.title}</Typography>
                                <Chip label={`Qty: ${item.count}`} size="small" color="primary" sx={{ mt: 0.5 }} />
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
