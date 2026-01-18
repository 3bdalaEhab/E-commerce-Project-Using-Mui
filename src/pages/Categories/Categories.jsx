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
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../components/Loading/Loading";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useTheme } from "@mui/material/styles";

export default function Categories() {
  const theme = useTheme();

  const getCategories = async () => {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
    return data.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">Error loading categories</Typography>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      <PageMeta
        title="Browse Categories"
        description="Premium shopping categories tailored for you."
      />

      <Box sx={{ pt: 10, pb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="1000" sx={{ mb: 1, letterSpacing: -1.5 }}>
          Product <Box component="span" sx={{ color: "primary.main" }}>Categories</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find exactly what you're looking for by browsing our curated collections
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <AnimatePresence>
            {data.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: "24px",
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        transform: "translateY(-8px)",
                        boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.06)"
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="260"
                      image={category.image}
                      alt={category.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ textAlign: "center", py: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900,
                          fontSize: "1.2rem",
                          letterSpacing: '-0.5px',
                          textTransform: "capitalize",
                          color: theme.palette.text.primary,
                          transition: 'color 0.3s ease',
                          ".MuiCard-root:hover &": { color: theme.palette.primary.main }
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">
                        Explore Collection
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </Box>
  );
}
