import React, { useContext, useEffect } from "react";
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
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../../components/Loading/Loading";
import { Helmet } from "react-helmet";
import PageMeta from "../../components/PageMeta/PageMeta";

export default function Wishlist() {
  // 🔹 Access wishlist state and functions from Context
  const { wishlist, removeFromWishlist, loading, getWishlist } = useContext(WishlistContext);

  // 🔹 Fetch wishlist data when the component mounts
  useEffect(() => {
    getWishlist();
  }, []);

  let navigate = useNavigate();

  // 🔄 Loading state: show loader while fetching data
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

  // 🟥 Empty wishlist state: show message when no items exist
  if (!wishlist.length) {
    return (<>
              <PageMeta  title={"My Wishlist"} description={"See all your favorite products in wishlist"}/>

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
                background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                boxShadow: "0 8px 25px rgba(25,118,210,0.4)",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </Box>
    </>);
  }
  


  // ✅ Wishlist with items: display all products
  return (<>
              <PageMeta  title={"My Wishlist"} description={"See all your favorite products in wishlist"}/>

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

      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {wishlist.map((item, index) => (
          <Grid item key={item._id}>
            {/* 🔹 Each card navigates to product details page */}
            <Card
              onClick={() => {
                navigate(`/details/${item._id}`);
              }}
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
              {/* 🔹 Product image */}
              <CardMedia
                component="img"
                height="220"
                image={item.imageCover}
                alt={item.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                {/* 🔹 Product title */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary.dark"
                  mb={1}
                >
                  {item.title
                    ? item.title.split(" ").slice(0, 3).join(" ")
                    : "No Title"}
                </Typography>
                {/* 🔹 Product price */}
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Price: ${item.price}
                </Typography>
                {/* 🔹 Remove from wishlist button */}
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={(e) => {removeFromWishlist(item._id)
                    e.stopPropagation();
                  }}
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
</>  );
}
