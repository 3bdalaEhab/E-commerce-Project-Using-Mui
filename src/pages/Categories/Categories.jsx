import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import Loading from "../../components/Loading/Loading";

export default function Categories() {
  // 🔹 Fetch all categories from the API
  const getCategories = async () => {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
    return data.data;
  };

  // 🔹 Use React Query to handle data fetching, loading, and error states
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // 🔹 Show loading spinner
  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Loading />
      </Box>
    );

  // 🔹 Show error message if fetching fails
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Error loading categories
      </Typography>
    );

  return (
    <Container sx={{ py: 5 }}>
      {/* 🔹 Page title with animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
            mb: 5,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Categories
        </Typography>
      </motion.div>

      {/* 🔹 Categories grid */}
      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.map((category, index) => (
          <Grid  item key={category._id}  >
            {/* 🔹 Card animation on load and hover */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.06, transition: { duration: 0.3 } }}
            >
              {/* 🔹 Category card */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  width: 260,
                  height: 300,
                  "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.2)" },
                }}
              
              >
                {/* 🔹 Category image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: "cover" }}
                />

                {/* 🔹 Category name */}
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
