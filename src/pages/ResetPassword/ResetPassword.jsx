import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff, CheckCircle, Email } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";

export default function ResetPassword() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const newPassword = watch("newPassword", "");

  const calculateStrength = useCallback((pass) => {
    let s = 0;
    if (pass.length >= 8) s += 25;
    if (/[a-z]/.test(pass)) s += 25;
    if (/[A-Z]/.test(pass)) s += 25;
    if (/[0-9]/.test(pass)) s += 15;
    if (/[#?!@$%^&*-]/.test(pass)) s += 10;
    setStrength(s);
  }, []);

  useEffect(() => {
    calculateStrength(newPassword);
  }, [newPassword, calculateStrength]);

  const togglePassword = useCallback(() => setShowPassword((s) => !s), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((s) => !s), []);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          email: formData.email.trim(),
          newPassword: formData.newPassword,
        }
      );

      showToast("✅ Password reset successful!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "❌ Reset failed.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = strength <= 30 ? theme.palette.error.main : strength <= 60 ? theme.palette.warning.main : theme.palette.success.main;
  const strengthLabel = strength <= 30 ? "Weak" : strength <= 60 ? "Fair" : "Strong";

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Set a strong password to recover your account"
      description="Enter your email and new password to reset."
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
              message: "Invalid email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
        />

        <CustomTextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          {...register("newPassword", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
              message: "Require 8+ chars, Upper, Lower, Number, Special",
            },
          })}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {newPassword && (
          <Box sx={{ mb: 2.5, px: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Strength</Typography>
              <Typography variant="caption" sx={{ color: strengthColor, fontWeight: "bold" }}>{strengthLabel}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={strength}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: theme.palette.action.hover,
                "& .MuiLinearProgress-bar": { bgcolor: strengthColor }
              }}
            />
          </Box>
        )}

        <CustomTextField
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          icon={Lock}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (val) => val === newPassword || "Passwords don't match",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "🔐 Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
