import React, { useContext, useCallback } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Divider,
    Chip,
    Stack,
    useTheme,
    Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { CartContext, useToast } from "../../Context";
import { CartSkeleton } from "../../components/Common/Skeletons";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PageMeta from "../../components/PageMeta/PageMeta";
import EmptyState from "../../components/Common/EmptyState";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Product, CartItem as CartItemType } from "../../types";
import { useTranslation } from "react-i18next";
import { translateAPIContent } from "../../utils/localization";

// 🔹 Memoized Cart Item Component
interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, count: number) => void;
    onRemove: (id: string) => void;
}

const CartItem = React.memo(({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // Guard against cases where item.product might be a string ID due to API response differences
    const product = typeof item.product === 'string' ? null : (item.product as Product);
    const productId = typeof item.product === 'string' ? item.product : item.product._id;

    if (!product) return null; // Or a smaller skeleton if we're re-fetching

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: "24px",
                    overflow: "hidden",
                    mb: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.palette.mode === 'dark' ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.05)"
                    },
                }}
            >
                <CardMedia
                    component="img"
                    image={product.imageCover}
                    alt={translateAPIContent(product.title, 'products')}
                    sx={{ width: { xs: "100%", sm: 200 }, height: { xs: 180, sm: "auto" }, objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1, p: { xs: 2.5, sm: 3.5 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight="900"
                                title={translateAPIContent(product.title, 'products')}
                                sx={{
                                    mb: 1,
                                    letterSpacing: '-0.5px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: { xs: '200px', sm: '300px', md: '400px' }
                                }}
                            >
                                {translateAPIContent(product.title, 'products')}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                                <Chip label={translateAPIContent(product.category?.name, 'categories')} size="small" variant="outlined" color="primary"
                                    sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.7rem' }} />
                                {product.brand && <Chip label={translateAPIContent(product.brand.name, 'brands')} size="small" variant="outlined"
                                    sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.7rem' }} />}
                            </Box>
                        </Box>
                        <Typography variant="h5" color="primary" fontWeight="900" sx={{ whiteSpace: 'nowrap' }}>
                            {item.price} <Box component="span" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>{t("common.egp")}</Box>
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: theme.palette.action.hover,
                            borderRadius: "12px",
                            p: 0.5,
                            border: `1px solid ${theme.palette.divider}`
                        }}>
                            <IconButton
                                size="small"
                                onClick={() => onUpdateQuantity(productId, item.count - 1)}
                                disabled={item.count <= 1}
                                sx={{ borderRadius: '10px' }}
                            >
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 2, fontWeight: "900", minWidth: '20px', textAlign: 'center' }}>{item.count}</Typography>
                            <IconButton
                                size="small"
                                onClick={() => onUpdateQuantity(productId, item.count + 1)}
                                sx={{ borderRadius: '10px' }}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Button
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => onRemove(productId)}
                            sx={{
                                textTransform: "none",
                                fontWeight: "900",
                                borderRadius: '12px',
                                "&:hover": { bgcolor: 'error.lighter' }
                            }}
                        >
                            {t("cart.remove")}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
});

CartItem.displayName = "CartItem";

export default function Cart() {
    const { cartData, loading, removeSpecificItem, removeAllItems, updateItem } = useContext(CartContext);
    const theme = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const updateQuantity = useCallback(async (productId: string, newCount: number) => {
        try {
            await updateItem(productId, newCount);
            showToast(t("toasts.quantityUpdated"), "success");
        } catch {
            showToast(t("toasts.error"), "error");
        }
    }, [updateItem, showToast, t]);

    const removeItem = useCallback(async (id: string) => {
        try {
            await removeSpecificItem(id);
            showToast(t("toasts.removedFromCart"), "success");
        } catch {
            showToast(t("toasts.error"), "error");
        }
    }, [removeSpecificItem, showToast, t]);

    const handleClearAll = useCallback(async () => {
        try {
            const res = await removeAllItems();
            if (res && (res.message === "success" || res.status === "success" || !res.error)) {
                showToast(t("toasts.cartCleared"), "success");
            }
        } catch {
            showToast(t("toasts.error"), "error");
        }
    }, [removeAllItems, showToast, t]);

    if (loading && !cartData) return <CartSkeleton />;

    if (!cartData || cartData.products.length === 0) return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            <PageMeta title={t("PageMeta.cartTitle")} description={t("PageMeta.cartDesc")} />
            <EmptyState
                title={t("cart.empty")}
                description={t("cart.emptyDesc")}
                actionText={t("cart.exploreCollections")}
                onAction={() => navigate("/")}
                icon={<ShoppingBagOutlinedIcon sx={{ fontSize: "3.5rem" }} />}
            />
        </Box>
    );

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
            <PageMeta title={t("PageMeta.cartTitle")} description={t("PageMeta.cartDesc")} />

            <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
                    <Box>
                        <Typography variant="h3" fontWeight="900" sx={{ mb: 1 }}>{t("cart.title")}</Typography>
                        <Typography variant="body1" color="text.secondary">{t("cart.subtitle")}</Typography>
                    </Box>
                    <Button variant="outlined" color="error" onClick={handleClearAll} sx={{ borderRadius: "10px" }}>
                        {t("cart.clearAll")}
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <AnimatePresence>
                            {cartData.products.map((item) => (
                                <CartItem
                                    key={item._id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeItem}
                                />
                            ))}
                        </AnimatePresence>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: "24px",
                                position: "sticky",
                                top: 100,
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: theme.palette.mode === 'dark' ? "0 20px 50px rgba(0,0,0,0.5)" : "0 20px 50px rgba(0,0,0,0.05)"
                            }}
                        >
                            <Typography variant="h5" fontWeight="900" sx={{ mb: 3, letterSpacing: '-1px' }}>{t("cart.summary")}</Typography>
                            <Stack spacing={2.5}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography color="text.secondary" fontWeight="500">{t("cart.productCount")}</Typography>
                                    <Typography fontWeight="900" variant="body1">{cartData.products.length}</Typography>
                                </Box>
                                <Divider sx={{ opacity: 0.6 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                    <Typography variant="h6" fontWeight="900">{t("cart.total")}</Typography>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h4" fontWeight="1000" color="primary.main" sx={{ lineHeight: 1 }}>
                                            {cartData.totalCartPrice}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight="700">{t("common.egp")} (Incl. VAT)</Typography>
                                    </Box>
                                </Box>

                                <Button
                                    component={Link}
                                    to={`/checkout/${cartData._id}`}
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<ShoppingCartCheckoutIcon />}
                                    sx={{
                                        mt: 2,
                                        py: 2,
                                        borderRadius: "14px",
                                        fontWeight: "900",
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        "&:hover": { transform: "translateY(-3px)", boxShadow: theme.shadows[12] }
                                    }}
                                >
                                    {t("cart.checkout")}
                                </Button>

                                <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 1 }}>
                                    🔒 {t("cart.secureTransaction")}
                                </Typography>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
