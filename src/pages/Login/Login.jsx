import React, { useState, useContext, useCallback } from "react";
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
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tokenContext } from "../../Context/tokenContext";
import { useToast } from "../../Context/ToastContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";

export default function Login() {
  const { setUserToken } = useContext(tokenContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = useCallback(() => setShowPassword((s) => !s), []);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      if (data.message === "success") {
        showToast("✅ Welcome back! Logged in successfully.", "success");
        setTimeout(() => {
          localStorage.setItem("userToken", data.token);
          setUserToken(data.token);
          navigate("/");
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Login failed. Please check your credentials.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      description="Access your account by logging in with your credentials."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 📧 Email Field */}
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

        {/* 🔒 Password Field */}
        <CustomTextField
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
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

        {/* 🔗 Forgot Password Link */}
        <Box sx={{ mb: 3, textAlign: "right" }}>
          <Link
            to="/forgot-password"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        {/* 🔘 Submit Button */}
        <Button
          type="submit"
          fullWidth
          disabled={loading || !isValid}
          variant="contained"
          sx={{
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1rem",
            background: loading
              ? "gray"
              : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "#fff",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "🔐 Login"}
        </Button>

        {/* 📝 Sign Up Link */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Create one now
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
}
