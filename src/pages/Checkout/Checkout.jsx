import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress,
  useTheme,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/PageMeta/PageMeta";

export default function Checkout() {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      details: "",
      phone: "",
      city: null,
    },
  });

  let { sessionId } = useParams();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false); // 🔹 حالة التحميل

  const cities = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Aswan",
    "Luxor",
    "Suez",
    "Ismailia",
    "Port Said",
    "Damietta",
    "Fayoum",
    "Minya",
    "Qena",
  ];

  const onSubmit = async (data) => {
    try {
      setLoading(true); // ⏳ بدء التحميل
      const token = localStorage.getItem("userToken");
      const { data: res } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${sessionId}?url=http://localhost:3000`,
        { shippingAddress: data },
        { headers: { token } }
      );

      window.location.href = res.session.url;
    } catch (error) {
      console.error(error);
      setToast({ open: true, message: "Checkout failed", type: "error" });
    } finally {
      setLoading(false); // ✅ إنهاء التحميل بعد العملية
    }
  };

  // 🔹 ستايل موحد للحقول
  const commonTextFieldStyles = {
    mb: 2,
    "& .MuiInputBase-input": {
      color:
        theme.palette.mode === "dark" ? "black" : theme.palette.text.primary,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.background : "#fff",
      borderRadius: "8px",
    },
    "& .MuiFormLabel-root": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.4)"
            : "rgba(0, 0, 0, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
      },
    },
  };

  return (
    <>
      <PageMeta
        key={"Checkout"}
        title="Checkout"
        description="Complete your order and payment securely"
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: 500,
            width: "100%",
            background: theme.palette.background.paper,
            padding: 32,
            borderRadius: 24,
            boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            textAlign="center"
            color={theme.palette.text.primary}
          >
            🛒 Checkout
          </Typography>

          {/* Details */}
          <Controller
            name="details"
            control={control}
            rules={{ required: "Details required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Details"
                fullWidth
                error={!!errors.details}
                helperText={errors.details?.message}
                autoComplete="off"
                sx={commonTextFieldStyles}
              />
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone required",
              pattern: {
                value: /^\d{11}$/,
                message: "Phone must be 11 digits",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                autoComplete="off"
                sx={commonTextFieldStyles}
              />
            )}
          />

          {/* City */}
          <Controller
            name="city"
            control={control}
            rules={{ required: "City required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={cities}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    sx={{
                      ...commonTextFieldStyles,
                      "& .MuiAutocomplete-popupIndicator": {
                        color: "black",
                        fontSize: 28,
                      },
                    }}
                  />
                )}
              />
            )}
          />

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Button
              onClick={handleSubmit(onSubmit)}
              fullWidth
              startIcon={!loading && <PaymentIcon />}
              disabled={loading} // 🔹 تعطيل الزرار وقت التحميل
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderRadius: "12px",
                textTransform: "none",
                background: loading
                  ? "gray"
                  : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                "&:hover": {
                  background: loading
                    ? "gray"
                    : `linear-gradient(90deg, ${
                        theme.palette.primary.dark || "#1565c0"
                      } 0%, ${theme.palette.secondary.dark || "#1e88e5"} 100%)`,
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                  Loading...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </motion.div>

          {/* Toast */}
          <Snackbar
            open={toast.open}
            autoHideDuration={2500}
            onClose={() => setToast({ ...toast, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity={toast.type}
              onClose={() => setToast({ ...toast, open: false })}
              variant="filled"
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "10px",
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Box>
    </>
  );
}
