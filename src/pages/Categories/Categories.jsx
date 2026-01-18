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
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const theme = useTheme();
  const navigate = useNavigate();

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

      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 4,
            px: { xs: 2, md: 4 }
          }}
        >
          <AnimatePresence>
            {data.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ height: "100%" }}
              >
                <Card
                  onClick={() => navigate("/products")}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "32px",
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-12px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 25px 50px rgba(0,0,0,0.5)"
                          : "0 25px 50px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: 350, overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={category.image}
                      alt={category.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.7s ease",
                        ".MuiCard-root:hover &": { transform: "scale(1.1)" }
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "40%",
                        background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        ".MuiCard-root:hover &": { opacity: 1 }
                      }}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: "center", py: 5, px: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography
                      variant="h5"
                      noWrap
                      sx={{
                        fontWeight: 1000,
                        letterSpacing: "-0.5px",
                        textTransform: "capitalize",
                        color: theme.palette.text.primary,
                        mb: 1,
                        transition: "color 0.3s ease",
                        ".MuiCard-root:hover &": { color: theme.palette.primary.main },
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="button"
                      color="text.secondary"
                      fontWeight="bold"
                      sx={{
                        opacity: 0.8,
                        letterSpacing: "1px",
                        fontSize: "0.85rem",
                        borderBottom: "2px solid transparent",
                        display: "inline-block",
                        mx: "auto",
                        pb: 0.5,
                        transition: "all 0.3s ease",
                        ".MuiCard-root:hover &": {
                          color: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                          opacity: 1
                        }
                      }}
                    >
                      DISCOVER COLLECTION
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}
