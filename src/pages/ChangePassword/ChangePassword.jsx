import axios from 'axios';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LinearProgress,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, CheckCircle, Logout } from '@mui/icons-material';
import PageMeta from '../../components/PageMeta/PageMeta';
import { useThemeContext } from '../../Context/ThemeContext';

export default function ChangePassword() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeContext();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
      newPassword: '',
      passwordConfirm: '',
    },
  });

  const password = watch('password');
  const newPassword = watch('newPassword');

  // ✅ إصلاح useEffect dependency
  const calculatePasswordStrength = useCallback((pwd) => {
    if (!pwd) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (pwd.length >= 8) strength += 20;
    if (pwd.length >= 12) strength += 10;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 15;
    setPasswordStrength(Math.min(strength, 100));
  }, []);

  useEffect(() => {
    calculatePasswordStrength(newPassword);
  }, [newPassword, calculatePasswordStrength]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setSnack({
        open: true,
        message: '❌ يجب تسجيل الدخول أولاً',
        severity: 'warning',
      });
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        setSnack({ open: true, message: '❌ يجب تسجيل الدخول أولاً', severity: 'error' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // ✅ استخدام الـ linked-posts API الصحيح
      const { data } = await axios.patch(
        'https://linked-posts.routemisr.com/users/change-password',
        {
          password: formData.password,        // كلمة المرور الحالية
          newPassword: formData.newPassword,  // كلمة المرور الجديدة
        },
        {
          headers: {
            token: token,
          },
        }
      );

      console.log('✅ تم تغيير كلمة المرور:', data);

      // حفظ التوكن الجديد لو موجود
      if (data.token) {
        localStorage.setItem('userToken', data.token);
      }

      setSnack({
        open: true,
        message: '✅ تم تغيير كلمة المرور بنجاح!',
        severity: 'success',
      });

      reset();
      setTimeout(() => navigate('/login', { replace: true }), 2500);

    } catch (error) {
      console.error('❌ خطأ:', error.response?.data);

      let msg = '❌ فشل تغيير كلمة المرور';
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.response?.data?.error) {
        msg = error.response.data.error;
      }

      setSnack({ open: true, message: msg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const textFieldStyle = {
    mb: 2.5,
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
      borderRadius: '8px',
    },
    '& .MuiFormLabel-root': {
      color: theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark'
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

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return theme.palette.error.main;
    if (passwordStrength <= 50) return theme.palette.warning.main;
    if (passwordStrength <= 75) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 25) return '🔴 ضعيفة جداً';
    if (passwordStrength <= 50) return '🟠 ضعيفة';
    if (passwordStrength <= 75) return '🟡 جيدة';
    return '🟢 قوية جداً';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      color: theme.palette.text.primary,
    }}>
      <PageMeta
        title="تغيير كلمة المرور"
        description="تغيير كلمة مرور حسابك بأمان."
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 520 }}
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
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <CheckCircle sx={{ fontSize: '3rem', color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                تغيير كلمة المرور
              </Typography>
              <Typography variant="body2" color="text.secondary">
                سيتم تسجيل الخروج تلقائياً بعد التغيير الناجح
              </Typography>
            </Box>
          </motion.div>

          {/* Current Password */}
          <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <TextField
              label="كلمة المرور الحالية *"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              fullWidth
              sx={textFieldStyle}
              {...register('password', {
                required: 'كلمة المرور الحالية مطلوبة',
                minLength: { value: 6, message: 'الحد الأدنى 6 أحرف' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" tabIndex={-1} sx={{ color: theme.palette.text.primary }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* New Password */}
          <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <TextField
              label="كلمة المرور الجديدة *"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              sx={textFieldStyle}
              {...register('newPassword', {
                required: 'كلمة المرور الجديدة مطلوبة',
                minLength: { value: 8, message: 'الحد الأدنى 8 أحرف' },
                validate: (value) => value === password && password ? 'يجب أن تكون مختلفة عن الحالية' : true,
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" tabIndex={-1} sx={{ color: theme.palette.text.primary }}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* Password Strength */}
          {newPassword && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>قوة كلمة المرور</Typography>
                  <Typography variant="body2" sx={{ color: getStrengthColor(), fontWeight: 'bold' }}>
                    {getStrengthLabel()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': { backgroundColor: getStrengthColor() },
                  }}
                />
              </Box>
            </motion.div>
          )}

          {/* Confirm Password */}
          <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <TextField
              label="تأكيد كلمة المرور الجديدة *"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              fullWidth
              sx={textFieldStyle}
              {...register('passwordConfirm', {
                required: 'يرجى تأكيد كلمة المرور',
                validate: (value) => value !== newPassword ? 'كلمة المرور غير متطابقة' : true,
              })}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" tabIndex={-1} sx={{ color: theme.palette.text.primary }}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
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
                background: loading ? 'gray' : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                '&:hover:not(:disabled)': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.dark || '#1565c0'} 0%, ${theme.palette.secondary.dark || '#1e88e5'} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                },
                '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Lock />
                  تغيير كلمة المرور
                </>
              )}
            </Button>
          </motion.div>

          {/* Cancel Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            onClick={() => {
              if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                localStorage.removeItem('userToken');
                navigate('/login');
              }
            }}
            sx={{
              mt: 2,
              py: 1,
              borderRadius: '10px',
              textTransform: 'none',
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
              },
            }}
            disabled={loading}
          >
            إلغاء وتسجيل خروج
          </Button>
        </Paper>
      </motion.div>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
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
