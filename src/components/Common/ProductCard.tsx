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
    useTheme,
    Stack,
} from "@mui/material";
import { Star, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material";
import { Product } from "../../types";
import { useQuickView } from "../../Context/QuickViewContext";

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
        const { openQuickView } = useQuickView();

        const cardVariants = {
            hidden: { opacity: 0, y: 30 },
            visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" as any, delay: i * 0.1 },
            }),
        };

        return (
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
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
                        overflow: "hidden", // Ensures content doesn't bleed
                        border: `1px solid ${theme.palette.divider}`,
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            borderColor: theme.palette.primary.main,
                            transform: "translateY(-8px)",
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 20px 40px rgba(0,0,0,0.6)'
                                : '0 20px 40px rgba(0,0,0,0.1)',
                            "& .product-image": { transform: "scale(1.1)" },
                            "& .action-overlay": { opacity: 1, transform: "translate(-50%, -50%)" },
                        },
                    }}
                    onClick={() => onNavigate(product._id)}
                >
                    <Box sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        height: 280,
                        borderTopLeftRadius: '24px', // Explicit radius to match card
                        borderTopRightRadius: '24px',
                    }}>
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
                        {/* Status Chip - Dynamic NEW ARRIVAL based on createdAt */}
                        {(() => {
                            const isNew = product.createdAt &&
                                (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
                            return isNew ? (
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
                            ) : null;
                        })()}
                    </Box>

                    <CardContent
                        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3, pt: 2.5 }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography
                                    variant="caption"
                                    color="primary.main"
                                    sx={{
                                        fontWeight: 1000,
                                        textTransform: "uppercase",
                                        fontSize: "0.65rem",
                                        opacity: 0.8,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '120px'
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
                                title={product.title}
                                sx={{
                                    fontWeight: 1000,
                                    lineHeight: 1.1,
                                    mb: 1,
                                    letterSpacing: "-0.8px",
                                    fontSize: '1.2rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {product.title}
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
                                <Typography
                                    variant="h5"
                                    fontWeight="1000"
                                    color="text.primary"
                                    sx={{
                                        letterSpacing: '-1px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {product.price} EGP
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
                            zIndex: 2,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(8px)",
                            color: isWishlisted ? theme.palette.error.main : "white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: '1px solid rgba(255,255,255,0.2)',
                            "&:hover": {
                                backgroundColor: isWishlisted ? theme.palette.error.main : "white",
                                color: isWishlisted ? "white" : theme.palette.text.primary,
                                transform: "scale(1.1)",
                            },
                        }}
                        onClick={(e) => onWishlistToggle(e, product._id)}
                    >
                        {isWishlisted ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </IconButton>

                    {/* Quick View Trigger (Eye Icon) */}
                    <Box
                        className="action-overlay"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) translateY(20px)',
                            opacity: 0,
                            zIndex: 3,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Visibility sx={{ fontSize: '1.1rem !important' }} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openQuickView(product);
                            }}
                            sx={{
                                borderRadius: '30px',
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                whiteSpace: 'nowrap',
                                minWidth: 'max-content',
                                bgcolor: 'rgba(255,255,255,0.95)',
                                color: 'black',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                px: { xs: 1.5, sm: 2.5 },
                                py: { xs: 0.8, sm: 1.2 },
                                '&:hover': {
                                    bgcolor: 'white',
                                    transform: 'scale(1.05)'
                                },
                                '& .MuiButton-startIcon': {
                                    mr: 0.5
                                }
                            }}
                        >
                            Quick View
                        </Button>
                    </Box>
                </Card>
            </motion.div>
        );
    }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
