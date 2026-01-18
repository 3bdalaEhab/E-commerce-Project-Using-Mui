import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  CircularProgress,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import { Lock, ArrowBack } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";

export default function VerifyResetCode() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        { resetCode: formData.resetCode.trim() }
      );

      if (data.status === "Success" || data.status === "success" || data.status === 200 || !data.error) {
        showToast("✅ Code verified successfully!", "success");
        setTimeout(() => navigate("/ResetPassword"), 1500);
      } else {
        showToast("❌ Unexpected response from server. Please try again.", "error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "❌ Verification failed.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Reset Code"
      subtitle="Enter the 6-digit code sent to your email"
      description="Verify the reset code received in your email."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          label="Reset Code"
          type="text"
          icon={Lock}
          {...register("resetCode", {
            required: "Reset code is required",
            minLength: { value: 6, message: "Code must be 6 digits" },
            maxLength: { value: 6, message: "Code must be 6 digits" },
          })}
          error={!!errors.resetCode}
          helperText={errors.resetCode?.message}
          disabled={loading}
        />

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
          {loading ? <CircularProgress size={24} color="inherit" /> : "🎯 Verify Code"}
        </Button>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link to="/forgot-password" style={{ textDecoration: "none", color: theme.palette.text.secondary, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, fontSize: "0.875rem" }}>
            <ArrowBack fontSize="inherit" /> Back to Forgot Password
          </Link>
        </Box>
      </form>
    </AuthLayout>
  );
}
