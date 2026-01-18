import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  CircularProgress,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";

export default function ForgetPass() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        { email: formData.email.trim() }
      );

      if (data.statusMsg === "success") {
        showToast("✅ Verification code sent to your email!", "success");
        reset();
        setTimeout(() => navigate("/VerifyResetCode"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "❌ Failed to send reset code.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email to receive a verification code"
      description="Reset your password by entering your email address."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          label="Email Address"
          type="email"
          icon={Email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
        />

        <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
          <Typography variant="body2" color="text.secondary">
            📧 We'll send a code to your inbox. Please check your spam folder too.
          </Typography>
        </Box>

        <Button
          type="submit"
          fullWidth
          disabled={loading || !isValid}
          variant="contained"
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "12px",
            background: loading ? "gray" : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "#fff",
            "&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 20px ${theme.palette.primary.main}40` }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "📤 Send Code"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: theme.palette.primary.main, fontWeight: "bold" }}>
            Back to Login
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
}
