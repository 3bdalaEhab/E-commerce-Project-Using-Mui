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
import DeleteIcon from "@mui/icons-material/Delete";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../../components/Loading/Loading";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../../Context/ThemeContext";

// ✅ Animation transition for Snackbar
function SlideUpTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist, loading, getWishlist } =
    useContext(WishlistContext);
  const navigate = useNavigate();

  const theme = useTheme();
  const { mode } = useThemeContext();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    getWishlist();
  }, []);

  const handleRemove = useCallback(
    async (e, id) => {
      e.stopPropagation();
      await removeFromWishlist(id);
      setSnackbar({
        open: true,
        message: "Item removed successfully",
        severity: "error",
      });
    },
    [removeFromWishlist]
  );

  // ✅ Loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Loading />
      </Box>
    );
  }

  // ✅ Empty wishlist view
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
            backgroundColor: theme.palette.background.default,
            borderRadius: 3,
            px: 2,
            color: theme.palette.text.primary,
          }}
        >
          <FavoriteBorderOutlinedIcon
            sx={{ fontSize: 90, color: theme.palette.primary.main, mb: 2 }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: theme.palette.text.primary }}
            gutterBottom
          >
            Your Wishlist is Empty
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 400,
              mb: 4,
            }}
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
                boxShadow:
                  mode === "light"
                    ? "0 6px 20px rgba(25,118,210,0.3)"
                    : "0 6px 20px rgba(144,202,249,0.3)",
              }}
            >
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </>
    );
  }

  // ✅ Wishlist with theme colors
  return (
    <>
      <PageMeta
        title="My Wishlist"
        description="See all your favorite products in wishlist"
      />

      <Container
        sx={{
          py: 5,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          transition: "background-color 0.3s ease",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={5}
          sx={{ color: theme.palette.text.primary }}
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
                  boxShadow:
                    mode === "light"
                      ? "0 4px 12px rgba(0,0,0,0.1)"
                      : "0 4px 20px rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: theme.palette.background.paper,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "background-color 0.3s, box-shadow 0.3s",
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
                    sx={{ color: theme.palette.primary.main, mb: 1 }}
                    noWrap
                  >
                    {item.title || "No Title"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary, mb: 2 }}
                  >
                    Price: ${item.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={(e) => handleRemove(e, item._id)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: "bold",
                      transition:"0.5s",
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: theme.palette.error.main,
                        color: "#fff",
                      },
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

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
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
