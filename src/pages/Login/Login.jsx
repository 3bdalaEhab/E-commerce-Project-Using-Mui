import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tokenContext } from "../../Context/tokenContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useThemeContext } from "../../Context/ThemeContext";

export default function Login() {
  const { setUserToken } = useContext(tokenContext);
  const theme = useTheme();
  const { mode } = useThemeContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((s) => !s);
  const handleSnackClose = () => setSnack((s) => ({ ...s, open: false }));

  const onSubmit = async (formData) => {
    setLoading(true);
    let receivedToken = null;

    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      if (data.token) receivedToken = data.token;

      setSnack({
        open: true,
        message: "✅ Logged in successfully!",
        severity: "success",
      });

      setTimeout(() => {
        if (receivedToken) {
          localStorage.setItem("userToken", receivedToken);
          setUserToken(receivedToken);
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "❌ Login failed. Please check your credentials.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ تنسيق ديناميكي يدعم Light/Dark Mode
  const textFieldStyle = {
    mb: 2,
    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
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
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)",
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        color: theme.palette.text.primary,
      }}
    >
      <PageMeta
        title="Login"
        description="Access your account by logging in with your credentials."
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Paper
          elevation={6}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* 📌 رأس الصفحة */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 1,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{
                mb: 3,
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
              }}
            >
              Sign in to your account to continue
            </Typography>
          </motion.div>

          {/* 📧 Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TextField
              label="Email Address"
              type="email"
              autoComplete="email"
              fullWidth
              sx={textFieldStyle}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* 🔒 Password Field */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              sx={textFieldStyle}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                validate: (value) => {
                  if (!/[A-Z]/.test(value)) return "Add uppercase letter";
                  if (!/[a-z]/.test(value)) return "Add lowercase letter";
                  if (!/[0-9]/.test(value)) return "Add a number";
                  if (!/[#?!@$%^&*-]/.test(value))
                    return "Add a special character";
                  return true;
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePassword}
                      edge="end"
                      sx={{
                        color: theme.palette.text.primary,
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* 🔗 Forgot Password Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Box sx={{ mb: 2, textAlign: "right" }}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </motion.div>

          {/* 🔘 Submit Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.3,
                fontWeight: "bold",
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                background: loading
                  ? "gray"
                  : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                "&:hover:not(:disabled)": {
                  background: `linear-gradient(90deg, ${
                    theme.palette.primary.dark || "#1565c0"
                  } 0%, ${theme.palette.secondary.dark || "#1e88e5"} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                },
                "&:disabled": {
                  opacity: 0.6,
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Signing in...
                </>
              ) : (
                "🔐 Login"
              )}
            </Button>

            {/* 📝 Sign Up & Forgot Password Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 2.5,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
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
            </motion.div>
          </motion.div>
        </Paper>
      </motion.div>

      {/* 🔔 Snackbar Notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={handleSnackClose}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}