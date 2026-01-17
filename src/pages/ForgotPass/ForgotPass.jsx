import axios from 'axios';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import PageMeta from '../../components/PageMeta/PageMeta';
import { useThemeContext } from '../../Context/ThemeContext';

export default function ForgetPass() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 📝 React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm({
    mode: 'onChange', // ✅ التحقق الفوري من الصحة
    defaultValues: {
      email: '',
    },
  });

  const emailValue = watch('email'); // ✅ مراقبة قيمة البريد الإلكتروني

  // 🔧 دالة إرسال كود التحقق
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords',
        { email: formData.email.trim() }
      );

      if (data.statusMsg === 'success') {
        setSnack({
          open: true,
          message: '✅ Verification code sent to your email!',
          severity: 'success',
        });

        // ⏰ إعادة تعيين الفورم والانتقال
        reset();
        setTimeout(() => {
          navigate('/VerifyResetCode');
        }, 1500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        '❌ Failed to send reset code. Please try again.';
      setSnack({
        open: true,
        message: msg,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 🎨 نمط التنسيق الديناميكي
  const textFieldStyle = {
    mb: 3,
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
      borderRadius: '8px',
    },
    '& .MuiFormLabel-root': {
      color:
        theme.palette.mode === 'dark'
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.2)'
            : 'rgba(0,0,0,0.2)',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary.main,
      },
    },
  };

  const handleSnackClose = () => {
    setSnack((s) => ({ ...s, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        color: theme.palette.text.primary,
      }}
    >
      <PageMeta
        title="Forgot Password"
        description="Reset your password by entering your email address."
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <Paper
          elevation={6}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
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
              Forgot Password?
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
              No worries! Enter your email address and we'll send you a
              verification code to reset your password.
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
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: 'Invalid email address',
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

          {/* 💡 Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.action.hover,
                p: 2,
                borderRadius: 2,
                mb: 3,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.95rem',
                }}
              >
                📧 We'll send a verification code to your email address. Check
                your inbox and spam folder.
              </Typography>
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
              disabled={loading || !isValid || !isDirty || !emailValue}
              sx={{
                py: 1.3,
                fontWeight: 'bold',
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                background: loading
                  ? 'gray'
                  : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                '&:hover:not(:disabled)': {
                  background: `linear-gradient(90deg, ${
                    theme.palette.primary.dark || '#1565c0'
                  } 0%, ${theme.palette.secondary.dark || '#1e88e5'} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                },
                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Sending Code...
                </>
              ) : (
                '📤 Send Verification Code'
              )}
            </Button>
          </motion.div>

          {/* 🔗 Back to Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 3, color: theme.palette.text.secondary }}
            >
              Remember your password?{' '}
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Back to Login
              </Link>
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>

      {/* 🔔 Snackbar Notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} onClose={handleSnackClose}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}