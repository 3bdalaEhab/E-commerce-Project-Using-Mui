import React, { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert, Autocomplete } from "@mui/material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/PageMeta/PageMeta";

export default function Checkout() {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      details: "",
      phone: "",
      city: null
    }
  });
  let {sessionId} = useParams()

  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const cities = ["Cairo", "Giza", "Alexandria", "Aswan", "Luxor", "Suez", "Ismailia", "Port Said", "Damietta", "Fayoum", "Minya", "Qena"];

  const onSubmit = async (data) => {
    
    try {
      const token = localStorage.getItem("userToken");
      const { data: res } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${sessionId}?url=http://localhost:3000`,
        { shippingAddress:data },{ 
        headers: {
          token:token
        }}
      )
      console.log(res);
      
      window.location.href = res.session.url;
      

      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      console.error(error);
      setToast({ open: true, message: "Checkout failed", type: "error" });
    }
  };

  return (<>
        <PageMeta
        key={"Checkout"}
        title="Checkout"
        description="Complete your order and payment securely"
      />
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 500, width: "100%", background: "#fff", padding: 32, borderRadius: 24,boxShadow: "0 10px 35px rgba(0,0,0,0.15)" }}
      >
    
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">🛒 Checkout</Typography>

        {/* Details Field */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
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
                sx={{ mb: 2 }}
              />
            )}
          />
        </motion.div>

        {/* Phone Field */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone required",
              pattern: { value: /^\d{11}$/, message: "Phone must be 11 digits" }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
        </motion.div>

        {/* City Field */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
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
                    sx={{ mb: 3 }}
                  />
                )}
              />
            )}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <Button
            onClick={handleSubmit(onSubmit)}
            fullWidth
            sx={{
              color:"white",
              py: 1.5,
              fontWeight: "bold",
              borderRadius: "12px",
              textTransform: "none",
              background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
              "&:hover": { background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)" }
            }}
          >
            Proceed to Payment
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
            sx={{ fontSize: "1rem", fontWeight: "bold", borderRadius: "10px" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
</>  );
}
