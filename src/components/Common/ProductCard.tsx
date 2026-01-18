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
    Theme,
    useTheme,
    Stack,
} from "@mui/material";
import { Star, Favorite } from "@mui/icons-material";
import { Product } from "../../types";

interface ProductCardProps {
    product: Product;
    index: number;
    onNavigate: (id: string) => void;
    onAddToCart: (id: string) => void;
    onWishlistToggle: (e: React.MouseEvent, id: string) => void;
    isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(
    ({
        product,
        index,
        onNavigate,
        onAddToCart,
        onWishlistToggle,
        isWishlisted,
    }) => {
        const theme = useTheme();

        const cardVariants = {
            hidden: { opacity: 0, y: 30 },
            visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" as any, delay: i * 0.1 },
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
                        borderRadius: "28px",
                        backgroundColor: theme.palette.background.paper,
                        position: "relative",
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            borderColor: theme.palette.primary.main,
                            transform: "translateY(-12px)",
                            "& .product-image": { transform: "scale(1.15)" },
                            "& .action-overlay": { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                    onClick={() => onNavigate(product._id)}
                >
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 280 }}>
                        <CardMedia
                            component="img"
                            image={product.imageCover}
                            alt={product.title}
                            className="product-image"
                            loading="lazy"
                            decoding="async"
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        />
                        {/* Status Chip */}
                        <Box sx={{ position: 'absolute', top: 15, left: 15, zIndex: 1 }}>
                            <Box sx={{
                                bgcolor: 'rgba(2, 6, 23, 0.8)',
                                backdropFilter: 'blur(8px)',
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '8px',
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                letterSpacing: '1px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                NEW ARRIVAL
                            </Box>
                        </Box>
                    </Box>

                    <CardContent
                        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3, pt: 2.5 }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography
                                    variant="subtitle2"
                                    color="primary"
                                    fontWeight="900"
                                    sx={{
                                        textTransform: "uppercase",
                                        letterSpacing: "1.5px",
                                        fontSize: "0.65rem",
                                        opacity: 0.8
                                    }}
                                >
                                    {product.category?.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                    }}
                                >
                                    <Star sx={{ color: "#FFB400", fontSize: 16 }} />
                                    <Typography variant="caption" fontWeight="900" sx={{ opacity: 0.7 }}>
                                        {product.ratingsAverage}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 1000,
                                    lineHeight: 1.1,
                                    mb: 1,
                                    letterSpacing: "-0.8px",
                                    fontSize: '1.2rem'
                                }}
                            >
                                {product.title.split(" ").slice(0, 2).join(" ")}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.5,
                                    fontSize: '0.85rem',
                                    opacity: 0.7
                                }}
                            >
                                {product.description}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: "auto", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ fontSize: '0.65rem', display: 'block', mb: -0.5 }}>PRICE</Typography>
                                <Typography variant="h5" fontWeight="1000" color="text.primary" sx={{ letterSpacing: '-1px' }}>
                                    ${product.price}
                                </Typography>
                            </Box>

                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(product._id);
                                }}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '12px',
                                    width: 48,
                                    height: 48,
                                    "&:hover": {
                                        bgcolor: 'primary.dark',
                                        transform: 'scale(1.1) rotate(5deg)'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                <ShoppingCartIcon sx={{ fontSize: 20 }} />
                            </IconButton>
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

ProductCard.displayName = "ProductCard";

export default ProductCard;
