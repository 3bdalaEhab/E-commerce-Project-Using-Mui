import React, { useContext, useEffect, useState, useCallback } from "react";
import { WishlistContext } from "../../Context/WishlistContext";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../../components/Loading/Loading";
import PageMeta from "../../components/PageMeta/PageMeta";

// ✅ Animation transition for Snackbar
function SlideUpTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading, getWishlist } =
    useContext(WishlistContext);
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch wishlist when mounted
  useEffect(() => {
    getWishlist();
  }, []);

  // 🔹 Handle remove
  const handleRemove = useCallback(
    async (e, id) => {
      e.stopPropagation();
      await removeFromWishlist(id);
      setSnackbar({
        open: true,
       message: "Item removed successfully ",
      severity: "error", 
      });
    },
    [removeFromWishlist]
  );

  // 🔹 Loading view
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Loading />
      </Box>
    );
  }

  // 🔹 Empty wishlist view
  if (!wishlist.length) {
    return (
      <>
        <PageMeta
          title="My Wishlist"
          description="See all your favorite products in wishlist"
        />
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
          <FavoriteBorderOutlinedIcon
            sx={{ fontSize: 90, color: "primary.main", mb: 2 }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.dark"
            gutterBottom
          >
            Your Wishlist is Empty
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 400, mb: 4 }}
          >
            Looks like you haven’t added anything yet. Start exploring our
            products and add your favorite items to your wishlist.
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
                  background:
                    "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                  boxShadow: "0 8px 25px rgba(25,118,210,0.4)",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </>
    );
  }

  // 🔹 Wishlist view
  return (
    <>
      <PageMeta
        title="My Wishlist"
        description="See all your favorite products in wishlist"
      />

      <Container sx={{ py: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={5}
          color="primary.main"
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Wishlist
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {wishlist.map((item, index) => (
            <Grid item key={item._id}>
              <Card
                onClick={() => navigate(`/details/${item._id}`)}
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                sx={{
                  width: 280,
                  height: 400,
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={item.imageCover}
                  alt={item.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.dark"
                    mb={1}
                    noWrap
                  >
                    {item.title || "No Title"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Price: ${item.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={(e) => handleRemove(e, item._id)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: "bold",
                    }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Snackbar in center bottom */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant="filled"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
