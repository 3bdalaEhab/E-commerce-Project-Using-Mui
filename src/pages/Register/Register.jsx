import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  CalendarMonth,
  Wc,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import PageMeta from "../../components/PageMeta/PageMeta";
import { useThemeContext } from "../../Context/ThemeContext";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const { mode } = useThemeContext();

  const handleSnackClose = () => setSnack((s) => ({ ...s, open: false }));

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        rePassword: data.rePassword.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      };

      await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", payload);
      setSnack({ open: true, message: "✅ Account created successfully!", severity: "success" });

      setTimeout(() => {
        navigate("/login");
        reset();
      }, 1200);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "❌ Something went wrong. Please try again.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

const textFieldStyle = {

    mb: 2,
    "& .MuiInputBase-input": {
      color: "black",
      
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

  // ✨ Animation helper
  const fieldAnimation = (x, delay) => ({
    initial: { opacity: 0, x },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.5, ease: "easeOut" },
  });

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
      <PageMeta title="Register" description="Create a new account." />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 500 }}
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
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            Fill in your details below
          </Typography>

          {/* Name */}
          <motion.div {...fieldAnimation(-25, 0.2)}>
            <TextField
              label="Full Name"
              fullWidth
              sx={textFieldStyle}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "At least 3 characters" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Email */}
          <motion.div {...fieldAnimation(25, 0.3)}>
            <TextField
              label="Email"
              type="email"
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
            />
          </motion.div>

          {/* Password */}
          <motion.div {...fieldAnimation(-25, 0.4)}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
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
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff  sx={{color:"black"}}/> : <Visibility  sx={{color:"black"}}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Confirm Password */}
          <motion.div {...fieldAnimation(25, 0.5)}>
            <TextField
              label="Confirm Password"
              type={showRePassword ? "text" : "password"}
              fullWidth
              sx={textFieldStyle}
              {...register("rePassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={!!errors.rePassword}
              helperText={errors.rePassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowRePassword(!showRePassword)}
                    >
                      {showRePassword ? <VisibilityOff sx={{color:"black"}}/> : <Visibility sx={{color:"black"}}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Date of Birth */}
          <motion.div {...fieldAnimation(-25, 0.6)}>
            <TextField
              label="Date of Birth"
              type="date"
              
              InputLabelProps={{ shrink: true }}
              fullWidth
sx={{
    ...textFieldStyle,
    '& input::-webkit-calendar-picker-indicator': {
          fontSize:20, 
        mr:1,
        borderRadius:10
    },
    
  }}              {...register("dateOfBirth", {
                required: "Date of Birth is required",
              })}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
              InputProps={{
                
                startAdornment: (
                  <InputAdornment  position="start">
                    <CalendarMonth  color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {/* Gender */}
          <motion.div {...fieldAnimation(25, 0.7)}>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <TextField
                  select
                  label="Gender"
                  fullWidth
          sx={{
        ...textFieldStyle,
        '& .MuiSelect-icon': {
        fontSize:35, 
        mr:1,
        color:"black"
        },
      }}                  {...field}
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Wc color="primary" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: "bold",
                borderRadius: "10px",
                textTransform: "none",
                background: loading
                  ? "gray"
                  : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.getContrastText(theme.palette.primary.main),
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
                  <CircularProgress size={20} color="inherit" />
                  Creating...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 3, color: theme.palette.text.secondary }}
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
                Login here
              </Link>
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={1500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
