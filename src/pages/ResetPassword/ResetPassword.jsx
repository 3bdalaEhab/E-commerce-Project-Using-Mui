import axios from 'axios';
import { useForm } from 'react-hook-form';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from '@mui/icons-material';
import PageMeta from '../../components/PageMeta/PageMeta';
import { useThemeContext } from '../../Context/ThemeContext';
import { tokenContext } from '../../Context/tokenContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();
  const { setUserToken } = useContext(tokenContext);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
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
    mode: 'onChange',
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  const email = watch('email');

  // 🔐 حساب قوة كلمة المرور
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[#?!@$%^&*-]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  React.useEffect(() => {
    if (newPassword) {
      calculatePasswordStrength(newPassword);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword]);

  // 🔧 دالة إعادة تعيين كلمة المرور
  const onSubmit = async (formData) => {
    setLoading(true);
    console.log('🔐 بدء تغيير كلمة المرور:', formData.email); // ✅ Debugging

    try {
      const { data } = await axios.put(
        'https://ecommerce.routemisr.com/api/v1/auth/resetPassword',
        {
          email: formData.email.trim(),
          newPassword: formData.newPassword,
        }
      );

      console.log('📡 استجابة API:', data); // ✅ Debugging

      // ✅ لا نحفظ التوكن ولا ندخل تلقائياً!
      setSnack({
        open: true,
        message: '✅ Password reset successfully! Please login with your new password.',
        severity: 'success',
      });

      reset();

      // ⏰ انتظر ثم اذهب لصفحة Login
      setTimeout(() => {
        console.log('🚀 انتقال إلى صفحة Login'); // ✅ Debugging
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('❌ خطأ في تغيير كلمة المرور:', err); // ✅ Debugging

      let msg = '❌ Failed to reset password. Please try again.';

      if (err.response) {
        msg =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.statusText ||
          msg;
      } else if (err.request) {
        msg = '❌ No response from server. Check your internet connection.';
      } else {
        msg = err.message || msg;
      }

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
    mb: 2.5,
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
        borderWidth: '2px',
      },
    },
  };

  const handleSnackClose = () => {
    setSnack((s) => ({ ...s, open: false }));
  };

  // 🎯 حالة قوة كلمة المرور
  const getStrengthColor = () => {
    if (passwordStrength <= 30) return theme.palette.error.main;
    if (passwordStrength <= 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 30) return 'Weak';
    if (passwordStrength <= 60) return 'Fair';
    return 'Strong';
  };

  const togglePassword = () => setShowPassword((s) => !s);
  const toggleConfirmPassword = () => setShowConfirmPassword((s) => !s);

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
        title="Reset Password"
        description="Create a new password to reset your account."
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 520 }}
      >
        {/* 📊 Stepper Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Stepper
            activeStep={2}
            sx={{
              mb: 4,
              '& .MuiStepLabel-root .Mui-active': {
                color: theme.palette.primary.main,
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: theme.palette.primary.main,
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: theme.palette.success.main,
              },
            }}
          >
            <Step completed>
              <StepLabel>Enter Email</StepLabel>
            </Step>
            <Step completed>
              <StepLabel>Verify Code</StepLabel>
            </Step>
            <Step active>
              <StepLabel>Reset Password</StepLabel>
            </Step>
          </Stepper>
        </motion.div>

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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle
                  sx={{
                    fontSize: '3rem',
                    color: theme.palette.success.main,
                    mb: 2,
                  }}
                />
              </motion.div>

              <Typography
                variant="h4"
                align="center"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Create New Password
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                Set a strong password to secure your account
              </Typography>
            </Box>
          </motion.div>

          {/* 📧 Email Field (Read Only) */}
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
                    <CheckCircle color="success" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* 🔒 New Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              sx={textFieldStyle}
              {...register('newPassword', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                validate: (value) => {
                  if (!/[A-Z]/.test(value)) return 'Add uppercase letter';
                  if (!/[a-z]/.test(value)) return 'Add lowercase letter';
                  if (!/[0-9]/.test(value)) return 'Add a number';
                  if (!/[#?!@$%^&*-]/.test(value)) return 'Add special character';
                  return true;
                },
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
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
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* 📊 Password Strength Indicator */}
          {newPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Box sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Password Strength
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: getStrengthColor(),
                      fontWeight: 'bold',
                    }}
                  >
                    {getStrengthLabel()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStrengthColor(),
                    },
                  }}
                />
              </Box>
            </motion.div>
          )}

          {/* 🔐 Confirm Password Field */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              sx={textFieldStyle}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => {
                  if (value !== newPassword) {
                    return 'Passwords do not match';
                  }
                  return true;
                },
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPassword}
                      edge="end"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* 💡 Password Requirements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
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
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Password Requirements:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}
              >
                ✓ At least 8 characters
                <br />
                ✓ One uppercase letter
                <br />
                ✓ One lowercase letter
                <br />
                ✓ One number
                <br />✓ One special character (#?!@$%^&*-)
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
              disabled={loading || !isValid || !isDirty}
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
                  Resetting Password...
                </>
              ) : (
                '🔐 Reset Password'
              )}
            </Button>
          </motion.div>

          {/* 🔗 Back to Login */}
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
              Changed your mind?{' '}
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Back to login
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