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
  CircularProgress,
} from "@mui/material";
import { Person, Email, Lock, Visibility, VisibilityOff, CalendarMonth, Wc } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// ✅ Motion variants لكل حقل
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors }, control, reset } = useForm();
  const navigate = useNavigate();
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const togglePassword = () => setShowPassword(prev => !prev);
  const toggleRePassword = () => setShowRePassword(prev => !prev);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("https://linked-posts.routemisr.com/users/signup", {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        rePassword: data.rePassword.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      });
      setSnack({ open: true, message: "Account created successfully!", severity: "success" });
      reset();
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="form"
      maxWidth="sm"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}
    >
      <Paper elevation={8} sx={{ p: 5, borderRadius: 3, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
        <motion.div initial="hidden" animate="visible" custom={0} variants={fieldVariants}>
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Create Account
          </Typography>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={1} variants={fieldVariants}>
          <TextField
            label="Full Name"
            fullWidth
            autoComplete="off"
            {...register("name", { required: "Name is required", minLength: { value: 3, message: "At least 3 characters" } })}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{ startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment> }}
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={2} variants={fieldVariants}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="off"
            {...register("email", { required: "Email is required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Invalid email" } })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{ startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment> }}
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={3} variants={fieldVariants}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            autoComplete="off"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton onClick={togglePassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
            }}
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={4} variants={fieldVariants}>
          <TextField
            label="Confirm Password"
            type={showRePassword ? "text" : "password"}
            fullWidth
            autoComplete="off"
            {...register("rePassword", { required: "Confirm password", validate: value => value === password || "Passwords do not match" })}
            error={!!errors.rePassword}
            helperText={errors.rePassword?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton onClick={toggleRePassword}>{showRePassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
            }}
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={5} variants={fieldVariants}>
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("dateOfBirth", { required: "Date of Birth is required" })}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth color="primary" /></InputAdornment> }}
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={6} variants={fieldVariants}>
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
                {...field}
                error={!!errors.gender}
                helperText={errors.gender?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><Wc color="primary" /></InputAdornment> }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            )}
          />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={7} variants={fieldVariants}>
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: "bold" }}>
            {loading ? <CircularProgress size={23} color="primary"  /> : "Register"}
          </Button>
        </motion.div>

      </Paper>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
}
