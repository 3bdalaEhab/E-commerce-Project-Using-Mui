import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/security";
import { logger } from "../../utils/logger";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageMeta from "../../components/PageMeta/PageMeta";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Divider,
    Alert,
    Container,
    Collapse,
    IconButton,
    Stack,
    Paper,
    Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    KeyboardArrowDown,
    ReceiptLong,
    LocalShipping,
    Payments,
    CalendarMonth,
    Inventory2
} from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";
import EmptyState from "../../components/Common/EmptyState";
import { orderService } from "../../services";
import { Order, Product } from "../../types";


const AllOrders: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});


    useEffect(() => {
        const userIdFromToken = getUserId();
        if (userIdFromToken) {
            setUserId(userIdFromToken);
        } else {
            logger.warn('No valid user ID found', 'AllOrders');
        }
    }, []);


    const { data: ordersData, isLoading, isError, error } = useQuery<Order[]>({
        queryKey: ["orders", userId],
        queryFn: () => userId ? orderService.getUserOrders(userId) : Promise.resolve([]),
        enabled: !!userId,
    });


    if (isLoading) return <Loading />;


    if (isError) {
        return (
            <Container maxWidth="md" sx={{ py: 10 }}>
                <Alert severity="error" sx={{ borderRadius: '16px' }}>
                    <strong>{t("orders.error")}</strong> {error instanceof Error ? error.message : "Unknown error"}
                </Alert>
            </Container>
        );
    }


    const ordersList: Order[] = Array.isArray(ordersData) ? ordersData : [];


    if (ordersList.length === 0) {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <PageMeta title={t("PageMeta.ordersTitle")} description={t("PageMeta.ordersDesc")} />
                <EmptyState
                    title={t("orders.noOrders")}
                    description={t("orders.noOrdersDesc")}
                    actionText={t("orders.startShopping")}
                    onAction={() => navigate("/")}
                    icon={<Inventory2 sx={{ fontSize: "3.5rem" }} />}
                />
            </Box>
        );
    }


    const toggleRowExpansion = (orderId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };


    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta title={t("PageMeta.ordersTitle")} description={t("PageMeta.ordersDesc")} />


            <Box sx={{ pt: 10, pb: 6, textAlign: "center" }}>
                <Typography variant="h3" fontWeight="1000" sx={{ mb: 1, letterSpacing: -1.5 }}>
                    {t("orders.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("orders.subtitle", { count: ordersList.length })}
                </Typography>
            </Box>


            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <AnimatePresence>
                        {ordersList.map((order, idx) => {
                            const isExpanded = !!expandedRows[order._id];
                            const cartItems = Array.isArray(order?.cartItems) ? order.cartItems : [];


                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            borderRadius: "24px",
                                            backgroundColor: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            overflow: "hidden",
                                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&:hover": {
                                                borderColor: theme.palette.primary.main,
                                                boxShadow: theme.palette.mode === 'dark' ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)"
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 4 }}>
                                            <Grid container spacing={4} alignItems="center">
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                                        <Box sx={{ p: 1, bgcolor: 'primary.transparent', borderRadius: '12px', color: 'primary.main', display: 'flex' }}>
                                                            <ReceiptLong />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
                                                                {t("orders.orderId", { id: order._id?.slice(-8).toUpperCase() })}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <CalendarMonth sx={{ fontSize: 14 }} />
                                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString(t("nav.home") === "Home" ? "en-US" : "ar-EG", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>


                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                                        <Chip
                                                            icon={<Payments sx={{ fontSize: '1rem !important' }} />}
                                                            label={order.isPaid ? t("orders.paid") : t("orders.pending")}
                                                            color={order.isPaid ? "success" : "warning"}
                                                            sx={{ fontWeight: 800, borderRadius: '10px' }}
                                                        />
                                                        <Chip
                                                            icon={<LocalShipping sx={{ fontSize: '1rem !important' }} />}
                                                            label={order.isDelivered ? t("orders.delivered") : t("orders.processing")}
                                                            color={order.isDelivered ? "success" : "info"}
                                                            sx={{ fontWeight: 800, borderRadius: '10px' }}
                                                        />
                                                        <IconButton
                                                            onClick={() => toggleRowExpansion(order._id)}
                                                            sx={{
                                                                bgcolor: 'action.hover',
                                                                transition: '0.3s',
                                                                transform: isExpanded ? 'rotate(180deg)' : 'none'
                                                            }}
                                                        >
                                                            <KeyboardArrowDown />
                                                        </IconButton>
                                                    </Stack>
                                                </Grid>
                                            </Grid>


                                            <Divider sx={{ my: 3, opacity: 0.5 }} />


                                            <Grid container spacing={4}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
                                                        {t("orders.totalPrice")}
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight="1000" color="primary.main">
                                                        {order.totalOrderPrice?.toFixed(2)} {t("common.egp")}
                                                    </Typography>
                                                </Grid>


                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '16px', border: `1px solid ${theme.palette.divider}` }}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                                            {t("orders.shippingTo")}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="700">
                                                            {order.shippingAddress?.details}, {order.shippingAddress?.city}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            📞 {order.shippingAddress?.phone}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </CardContent>


                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                            <Box sx={{ p: 4, pt: 0, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}>
                                                <Typography variant="subtitle1" fontWeight="900" sx={{ mb: 3 }}>{t("orders.items", { count: cartItems.length })}</Typography>
                                                <Grid container spacing={2}>
                                                    {cartItems.map((item, i) => (
                                                        <Grid size={12} key={item._id || i}>
                                                            {(() => {
                                                                const product = typeof item.product === 'string' ? null : (item.product as Product);
                                                                if (!product) return null;
                                                                return (
                                                                    <Card elevation={0} sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 2,
                                                                        p: 1.5,
                                                                        borderRadius: '16px',
                                                                        border: `1px solid ${theme.palette.divider}`,
                                                                        bgcolor: 'background.paper'
                                                                    }}>
                                                                        <CardMedia
                                                                            component="img"
                                                                            image={product.imageCover}
                                                                            alt={product.title}
                                                                            sx={{ width: 60, height: 60, borderRadius: '10px', objectFit: 'cover' }}
                                                                        />
                                                                        <Box sx={{ flex: 1 }}>
                                                                            <Typography variant="body2" fontWeight="800">{product.title}</Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {t("orders.qty", { count: item.count, price: item.price })}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Typography variant="subtitle2" fontWeight="900" color="primary">
                                                                            {(item.count * item.price).toFixed(2)} {t("common.egp")}
                                                                        </Typography>
                                                                    </Card>
                                                                );
                                                            })()}
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        </Collapse>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </Stack>
            </Container>
        </Box>
    );
};


export default AllOrders;
