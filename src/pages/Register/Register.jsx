import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Container,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Slide,
  CircularProgress,
  Box,
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

// ✅ Transition Animation for Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// ✅ Animated Paper (Form)
const MotionPaper = motion.create(Paper);

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
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false); // ✅ نتحكم في حالة التحميل

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowRePassword = () => setShowRePassword((prev) => !prev);

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    setLoading(true); // ⏳ نبدأ التحميل
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        rePassword: data.rePassword.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      };

      const response = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        payload
      );

      setErrorMsg("✅ Account created successfully!");
      setOpen(true);
      reset();
    } catch (error) {
      if (error.message === "Network Error") {
        setErrorMsg("⚠️ No Internet Connection. Please check your network.");
      } else if (error.code === "ECONNABORTED") {
        setErrorMsg("⏱️ Connection timed out. Try again later.");
      } else if (error.response) {
        setErrorMsg(`❌ ${error.response?.data?.error || "Server Error"}`);
      } else {
        setErrorMsg("❌ Something went wrong. Please try again.");
      }
      setOpen(true);
    } finally {
      setLoading(false); // ✅ نوقف التحميل بعد أي نتيجة
    }
  };

  return (
    <Container
      component={"form"}
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "30px",
        // bgcolor: "primary.main",
        // minHeight: "100vh",
        // minWidth:"100vw",
        py: { xs: 2, sm: 4 },
      }}
    >
      <MotionPaper
        elevation={8}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        sx={{
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
        >
          Create Account
        </Typography>

        {/* Full Name */}
        <TextField
          autoComplete="off"
          label="Full Name"
          variant="outlined"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 3, message: "At least 3 characters" },
            maxLength: { value: 20, message: "Less than 20 characters" },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Email */}
        <TextField
          autoComplete="off"
          label="Email"
          type="email"
          variant="outlined"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Password */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          variant="outlined"
          {...register("password", {
            required: "Password is required",
            validate: (value) => {
              if (value.length < 8) return "At least 8 characters";
              if (!/[A-Z]/.test(value)) return "Add uppercase letter";
              if (!/[a-z]/.test(value)) return "Add lowercase letter";
              if (!/[0-9]/.test(value)) return "Add a number";
              if (!/[#?!@$%^&*-]/.test(value)) return "Add a special character";
              return true;
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password */}
        <TextField
          autoComplete="off"
          label="Confirm Password"
          type={showRePassword ? "text" : "password"}
          variant="outlined"
          {...register("rePassword", {
            required: "Please confirm password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={!!errors.rePassword}
          helperText={errors.rePassword?.message}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowRePassword}>
                  {showRePassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Date of Birth */}
        <TextField
          autoComplete="off"
          label="Date of Birth"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register("dateOfBirth", {
            required: "Date of Birth is required",
          })}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth?.message}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonth color="primary" />
              </InputAdornment>
            ),
          }}
        />

        {/* Gender */}
        {/* <TextField
          select
          label="Gender"
          defaultValue=""
          {...register("gender", { required: "Gender is required" })}
          error={!!errors.gender}
          helperText={errors.gender?.message}
          fullWidth
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
        </TextField> */}
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <TextField
              select
              label="Gender"
              {...field}
              error={!!errors.gender}
              helperText={errors.gender?.message}
              fullWidth
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
        {/* Submit Button */}
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
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Sending...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </MotionPaper>

      {/* Snackbar Notification */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          sx={{
            bgcolor: "white",
            color: "black",
            fontWeight: "bold",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            borderRadius: "10px",
          }}
          icon={false}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
