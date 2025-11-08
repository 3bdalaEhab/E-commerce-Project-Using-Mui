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
import PageMeta from "../../components/PageMeta/PageMeta";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../../Context/ThemeContext";

export default function Categories() {
  const theme = useTheme();
  const { mode } = useThemeContext();

  // 🔹 Fetch categories from API
  const getCategories = async () => {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
    return data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <PageMeta
          title="Categories"
          description="Browse products by categories and find what you need easily."
        />
        <Loading />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Error loading categories
      </Typography>
    );

  return (
    <Container
      sx={{
        py: 5,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <PageMeta
        title="Categories"
        description="Browse products by categories and find what you need easily."
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            mb: 5,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Categories
        </Typography>
      </motion.div>

      {/* Categories Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.map((category, index) => (
          <Grid item key={category._id}>
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
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    mode === "light"
                      ? "0 4px 12px rgba(0,0,0,0.1)"
                      : "0 4px 20px rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  width: 260,
                  height: 300,
                  backgroundColor: theme.palette.background.paper,
                  transition: "background-color 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    boxShadow:
                      mode === "light"
                        ? "0 8px 20px rgba(0,0,0,0.2)"
                        : "0 8px 25px rgba(255,255,255,0.15)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      textTransform: "capitalize",
                      color: theme.palette.primary.main,
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
