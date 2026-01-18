import React, { useState, useCallback } from "react";
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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  CalendarToday,
  Wc,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const genderValue = watch("gender", "male");

  const togglePassword = useCallback(() => setShowPassword((s) => !s), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((s) => !s), []);

  const handleGenderChange = useCallback((_, newGender) => {
    if (newGender !== null) {
      setValue("gender", newGender, { shouldValidate: true });
    }
  }, [setValue]);

  const onSubmit = async (formData) => {
    setLoading(false); // Reset but logic follows
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rePassword: formData.rePassword,
        phone: formData.phone,
      };

      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        payload
      );

      if (data.message === "success") {
        showToast("✅ Account created successfully!", "success");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "❌ Registration failed. Try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community and start shopping"
      description="Register a new account with your personal details."
      maxWidth={520}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 👤 Name Field */}
        <CustomTextField
          label="Full Name"
          icon={Person}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "Min 3 characters" },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={loading}
        />

        {/* 📧 Email Field */}
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

        {/* 🔒 Password Field */}
        <CustomTextField
          label="Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
              message: "Require 8+ chars, Upper, Lower, Number, Special",
            },
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

        {/* 🔒 Confirm Password Field */}
        <CustomTextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          icon={Lock}
          {...register("rePassword", {
            required: "Confirm password is required",
            validate: (value) => value === watch("password") || "Passwords don't match",
          })}
          error={!!errors.rePassword}
          helperText={errors.rePassword?.message}
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

        {/* 📞 Phone Field */}
        <CustomTextField
          label="Phone Number"
          icon={CalendarToday}
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^01[0125][0-9]{8}$/,
              message: "Invalid Egyptian phone number",
            },
          })}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          disabled={loading}
        />

        {/* 👫 Gender Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Wc fontSize="small" color="primary" /> Select Gender
          </Typography>
          <ToggleButtonGroup
            value={genderValue}
            exclusive
            onChange={handleGenderChange}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '10px !important',
                mx: 0.5,
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                '&.Mui-selected': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: '#fff',
                  '&:hover': {
                    filter: 'brightness(1.1)',
                  }
                }
              }
            }}
          >
            <ToggleButton value="male" disabled={loading}>Male</ToggleButton>
            <ToggleButton value="female" disabled={loading}>Female</ToggleButton>
          </ToggleButtonGroup>
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "🚀 Create Account"}
        </Button>

        {/* 📝 Login Link */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Sign in
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
}
