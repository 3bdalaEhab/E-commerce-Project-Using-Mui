import React, { useState, useCallback } from "react";
import {
    Box,
    Button,
    Typography,
    Autocomplete,
    CircularProgress,
    useTheme,
    Paper,
    Container,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useToast } from "../../Context";
import CustomTextField from "../../components/Common/CustomTextField";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { orderService } from "../../services";

interface CheckoutFormData {
    details: string;
    phone: string;
    city: string | null;
    paymentMethod: 'cash' | 'card';
}

const Checkout: React.FC = () => {
    const theme = useTheme();
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
        defaultValues: { details: "", phone: "", city: null, paymentMethod: 'cash' },
    });

    const paymentMethod = watch('paymentMethod');

    const cities = ["Cairo", "Giza", "Alexandria", "Aswan", "Luxor", "Suez", "Ismailia", "Port Said", "Damietta", "Fayoum", "Minya", "Qena"];

    const onSubmit = useCallback(async (formData: CheckoutFormData) => {
        if (!sessionId) return;
        try {
            setLoading(true);
            const shippingData = {
                shippingAddress: {
                    details: formData.details,
                    phone: formData.phone,
                    city: formData.city as string
                }
            };

            if (formData.paymentMethod === 'card') {
                const res = await orderService.createCheckoutSession(sessionId, shippingData);
                if (res.session?.url) {
                    window.location.href = res.session.url;
                }
            } else {
                const res = await orderService.createCashOrder(sessionId, shippingData);
                if (res.data) {
                    showToast("🎉 Order placed successfully with Cash!", "success");
                    navigate("/allOrders");
                }
            }
        } catch {
            showToast("❌ Checkout failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [sessionId, showToast, navigate]);

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 10, display: "flex", alignItems: "center" }}>
            <PageMeta title="Checkout" description="Secure payment and delivery details." />

            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 6 },
                            borderRadius: "24px",
                            bgcolor: "background.paper",
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.palette.mode === "dark"
                                ? "0 20px 60px rgba(0,0,0,0.5)"
                                : "0 20px 60px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Box sx={{ textAlign: "center", mb: 5 }}>
                            <Typography variant="h3" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>
                                Checkout
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Complete your order details below
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="details"
                                control={control}
                                rules={{ required: "Address details are required" }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label="Shipping Address"
                                        placeholder="Street name, building number, etc."
                                        icon={LocalShippingIcon}
                                        error={!!errors.details}
                                        helperText={errors.details?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: "Phone number is required",
                                    pattern: { value: /^\d{11}$/, message: "Please enter a valid 11-digit phone number" }
                                }}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label="Phone Number"
                                        placeholder="01xxxxxxxxx"
                                        icon={PhoneIphoneIcon}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: "Selecting a city is required" }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={cities}
                                        onChange={(_, value) => field.onChange(value)}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label="City"
                                                icon={LocationCityIcon}
                                                error={!!errors.city}
                                                helperText={errors.city?.message}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Typography variant="subtitle2" fontWeight="800" sx={{ mt: 3, mb: 1, color: 'text.secondary' }}>
                                Payment Method
                            </Typography>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                        {[
                                            { value: 'cash', label: 'Cash on Delivery', icon: LocalShippingIcon },
                                            { value: 'card', label: 'Credit Card', icon: PaymentIcon }
                                        ].map((method) => {
                                            const active = field.value === method.value;
                                            return (
                                                <Box
                                                    key={method.value}
                                                    onClick={() => field.onChange(method.value)}
                                                    sx={{
                                                        flex: 1,
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        borderRadius: '16px',
                                                        border: `2px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
                                                        bgcolor: active ? `${theme.palette.primary.main}08` : 'transparent',
                                                        transition: 'all 0.3s ease',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        '&:hover': {
                                                            borderColor: active ? theme.palette.primary.main : `${theme.palette.primary.main}40`,
                                                            bgcolor: active ? `${theme.palette.primary.main}08` : `${theme.palette.primary.main}04`,
                                                        }
                                                    }}
                                                >
                                                    <method.icon sx={{ color: active ? 'primary.main' : 'text.disabled' }} />
                                                    <Typography variant="caption" fontWeight="900" color={active ? 'text.primary' : 'text.disabled'}>
                                                        {method.label}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                )}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading}
                                variant="contained"
                                size="large"
                                startIcon={!loading && <PaymentIcon />}
                                sx={{
                                    mt: 1, py: 2, borderRadius: "14px", fontWeight: "bold", fontSize: "1.1rem",
                                    textTransform: "none",
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    "&:hover": { transform: "translateY(-4px) scale(1.02)", boxShadow: theme.shadows[15] }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : (
                                    paymentMethod === 'cash' ? "Place Cash Order" : "Proceed to Secure Payment"
                                )}
                            </Button>
                        </form>

                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                            🔒 Secure SSL Encryption • Trusted Payment Gateway
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Checkout;
