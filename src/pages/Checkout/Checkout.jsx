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
import axios from "axios";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useToast } from "../../Context/ToastContext";
import CustomTextField from "../../components/Common/CustomTextField";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationCityIcon from "@mui/icons-material/LocationCity";

export default function Checkout() {
  const theme = useTheme();
  const { sessionId } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { details: "", phone: "", city: null },
  });

  const cities = ["Cairo", "Giza", "Alexandria", "Aswan", "Luxor", "Suez", "Ismailia", "Port Said", "Damietta", "Fayoum", "Minya", "Qena"];

  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const { data: res } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${sessionId}?url=${window.location.origin}`,
        { shippingAddress: data },
        { headers: { token } }
      );
      window.location.href = res.session.url;
    } catch (error) {
      showToast("❌ Checkout failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [sessionId, showToast]);

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

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                size="large"
                startIcon={!loading && <PaymentIcon />}
                sx={{
                  mt: 3, py: 2, borderRadius: "14px", fontWeight: "bold", fontSize: "1.1rem",
                  textTransform: "none",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  "&:hover": { transform: "scale(1.02)", boxShadow: theme.shadows[10] }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Proceed to Secure Payment"}
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
}
