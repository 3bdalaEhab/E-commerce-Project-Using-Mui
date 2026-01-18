import React from "react";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Button,
} from "@mui/material";
import { Star, Favorite } from "@mui/icons-material";

const ProductCard = React.memo(
    ({
        product,
        index,
        onNavigate,
        onAddToCart,
        onWishlistToggle,
        isWishlisted,
        theme,
    }) => {
        const cardVariants = {
            hidden: { opacity: 0, y: 30 },
            visible: (i) => ({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
            }),
            hover: {
                y: -8,
                boxShadow:
                    theme.palette.mode === "light"
                        ? "0 12px 30px rgba(0,0,0,0.12)"
                        : "0 12px 30px rgba(0,0,0,0.4)",
            },
        };

        return (
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                custom={index % 4}
                viewport={{ once: true, amount: 0.2 }}
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
                <Card
                    sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        borderRadius: "24px",
                        backgroundColor: theme.palette.background.paper,
                        position: "relative",
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            borderColor: theme.palette.primary.main,
                            boxShadow:
                                theme.palette.mode === "dark"
                                    ? "0 20px 40px rgba(0,0,0,0.4)"
                                    : "0 20px 40px rgba(0,0,0,0.06)",
                        },
                    }}
                    onClick={() => onNavigate(product._id)}
                >
                    <CardMedia
                        component="img"
                        image={product.imageCover}
                        alt={product.title}
                        sx={{ height: 260, objectFit: "cover" }}
                    />

                    <CardContent
                        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="subtitle2"
                                color="primary"
                                fontWeight="800"
                                sx={{
                                    mb: 0.5,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    fontSize: "0.7rem",
                                }}
                            >
                                {product.category?.name}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                    mb: 1,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                {product.title.split(" ").slice(0, 3).join(" ")}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.6,
                                }}
                            >
                                {product.description}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: "auto" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2.5,
                                }}
                            >
                                <Typography variant="h5" fontWeight="900" color="text.primary">
                                    ${product.price}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        bgcolor: theme.palette.action.hover,
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: "8px",
                                    }}
                                >
                                    <Star sx={{ color: "#FFB400", fontSize: 18 }} />
                                    <Typography variant="caption" fontWeight="900">
                                        {product.ratingsAverage}
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ShoppingCartIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(product._id);
                                }}
                                sx={{
                                    borderRadius: "14px",
                                    py: 1.5,
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    fontSize: "0.95rem",
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: theme.shadows[10],
                                    },
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    </CardContent>

                    <IconButton
                        sx={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(15, 23, 42, 0.7)"
                                    : "rgba(255,255,255,0.8)",
                            backdropFilter: "blur(8px)",
                            color: isWishlisted
                                ? theme.palette.error.main
                                : theme.palette.text.secondary,
                            boxShadow: theme.shadows[2],
                            "&:hover": {
                                backgroundColor: isWishlisted
                                    ? theme.palette.error.main
                                    : theme.palette.primary.main,
                                color: "#fff",
                                transform: "scale(1.1)",
                            },
                            transition: "all 0.3s ease",
                        }}
                        onClick={(e) => onWishlistToggle(e, product._id)}
                    >
                        <Favorite fontSize="small" />
                    </IconButton>
                </Card>
            </motion.div>
        );
    }
);

export default ProductCard;
