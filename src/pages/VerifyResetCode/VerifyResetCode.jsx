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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Lock, ArrowBack } from '@mui/icons-material';
import PageMeta from '../../components/PageMeta/PageMeta';
import { useThemeContext } from '../../Context/ThemeContext';

export default function VerifyResetCode() {
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
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      resetCode: '',
    },
  });

  const codeValue = watch('resetCode');

  // 🔧 دالة التحقق من الكود
  const onSubmit = async (formData) => {
    setLoading(true);
    console.log('🔍 بدء التحقق من الكود:', formData.resetCode); // ✅ Debugging

    try {
      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode',
        {
          resetCode: formData.resetCode.trim(),
        }
      );

      console.log('📡 استجابة API:', data); // ✅ Debugging

      // ✅ التحقق من النجاح بطرق متعددة
      if (
        data.statusMsg === 'success' ||
        data.message === 'Success' ||
        data.status === 200 ||
        !data.error
      ) {
        setSnack({
          open: true,
          message: '✅ Code verified successfully!',
          severity: 'success',
        });

        // ⏰ انتظر قليلاً ثم انتقل
        const timer = setTimeout(() => {
          console.log('🚀 انتقال إلى صفحة ResetPassword'); // ✅ Debugging
          navigate('/ResetPassword', { replace: true });
        }, 1500);

        // تنظيف التايمر عند فك التثبيت
        return () => clearTimeout(timer);
      } else {
        // إذا لم يكن هناك رسالة نجاح واضحة
        setSnack({
          open: true,
          message: '❌ Unexpected response from server. Please try again.',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('❌ خطأ في التحقق:', err); // ✅ Debugging

      // معالجة الأخطاء بشكل أفضل
      let msg = '❌ Failed to verify code. Please try again.';

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
    mb: 3,
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
      borderRadius: '8px',
      fontSize: '1.5rem',
      letterSpacing: '0.5rem',
      textAlign: 'center',
      fontWeight: 'bold',
      textTransform: 'uppercase',
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
        title="Verify Reset Code"
        description="Enter the verification code sent to your email to reset your password."
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        {/* 📊 Stepper Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Stepper
            activeStep={1}
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
            <Step active>
              <StepLabel>Verify Code</StepLabel>
            </Step>
            <Step>
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
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Lock
                  sx={{
                    fontSize: '3rem',
                    color: theme.palette.primary.main,
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
                Verify Your Code
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                Enter the 6-digit verification code sent to your email address
              </Typography>
            </Box>
          </motion.div>

          {/* 🔢 Verification Code Field */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TextField
              label="Verification Code"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              fullWidth
              placeholder="000000"
              maxLength="6"
              sx={textFieldStyle}
              {...register('resetCode', {
                required: 'Verification code is required',
                minLength: {
                  value: 6,
                  message: 'Code must be 6 digits',
                },
                maxLength: {
                  value: 6,
                  message: 'Code must be 6 digits',
                },
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Code must contain only numbers',
                },
              })}
              error={!!errors.resetCode}
              helperText={errors.resetCode?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
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
                mt: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.95rem',
                  mb: 1,
                }}
              >
                ⏰ <strong>Code expires in 10 minutes</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.95rem',
                }}
              >
                Didn't receive a code?{' '}
                <Box
                  component="span"
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  Resend Code
                </Box>
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
              disabled={loading || !isValid || !isDirty || !codeValue}
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
                  Verifying Code...
                </>
              ) : (
                '✅ Verify Code'
              )}
            </Button>
          </motion.div>

          {/* 🔗 Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              fullWidth
              startIcon={<ArrowBack />}
              onClick={() => navigate('/forgot-password')}
              sx={{
                mt: 2,
                textTransform: 'none',
                fontSize: '0.95rem',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Back to Email Entry
            </Button>
          </motion.div>
        </Paper>

        {/* 📝 Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 3,
              color: theme.palette.text.secondary,
              lineHeight: 1.8,
            }}
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
              Go back to login
            </Link>
          </Typography>
        </motion.div>
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