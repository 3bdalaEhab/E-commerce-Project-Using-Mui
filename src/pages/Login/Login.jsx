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
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { data, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tokenContext } from "../../Context/tokenContext";
import PageMeta from "../../components/PageMeta/PageMeta";

export default function Login() {
  const { setUserToken } = useContext(tokenContext);
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

  // دالة الإغلاق البسيطة للـ Snackbar
  const handleSnackClose = () => {
    setSnack((s) => ({ ...s, open: false }));
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    let receivedToken = null;

    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      if (data.token) {
        receivedToken = data.token;
      }

      setSnack({
        open: true,
        message: "Logged in successfully!",
        severity: "success",
      });

      // 💡 الحل القصير: تأخير التحديث والانتقال لمدة 1200 ميلي ثانية
      setTimeout(() => {
        if (receivedToken) {
          localStorage.setItem("userToken", receivedToken);
          setUserToken(receivedToken);
          navigate("/");
        }
      }, 1000); // ✅ المدة الجديدة
    } catch (err) {
      // هنا لا يتغير شيء، الخطأ يعمل بشكل صحيح
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "❌ Login failed. Please check your credentials.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
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
          sx={{ width: "100%", p: 4, borderRadius: 3 }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 1, fontWeight: 700 }}
          >
            Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 2, color: "text.secondary" }}
          >
            Enter your credentials
          </Typography>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TextField
              label="Email"
              type="email"
              autoComplete="new-email"
              fullWidth
              sx={{ mb: 2 }}
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
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              sx={{ mb: 2 }}
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
                    <IconButton onClick={togglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                borderRadius: "10px",
                py: 1.2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 3, color: "text.secondary" }}
            >
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Create one now
              </Link>
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>

      <Snackbar
        open={snack.open}
        autoHideDuration={1000} // ✅ مدة ظهور الـ Snackbar (1.2 ثانية)
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
