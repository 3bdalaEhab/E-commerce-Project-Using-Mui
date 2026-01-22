import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
    Avatar,
    Button,
    TextField,
    CircularProgress,
    Divider,
    List,
    IconButton,
    Chip,
    Badge,
    Stack,
    useTheme,
    alpha,
    Skeleton,
    InputAdornment,
    LinearProgress,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Lock,
    ShoppingBag,
    Edit,
    CameraAlt,
    Save,
    Cancel,
    Visibility,
    VisibilityOff,
    CheckCircle,
    LocalShipping,
    Payment,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../Context';
import { useThemeContext } from '../../Context/ThemeContext';
import { userService, authService, orderService } from '../../services';
import { storage } from '../../utils/storage';
import { decodeToken } from '../../utils/security';
import { Order } from '../../types';
import PageMeta from '../../components/PageMeta/PageMeta';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
    gender: 'male' | 'female';
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
    <AnimatePresence mode="wait">
        {value === index && (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                role="tabpanel"
            >
                <Box sx={{ py: 3 }}>{children}</Box>
            </motion.div>
        )}
    </AnimatePresence>
);

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { primaryColor } = useThemeContext();
    const { showToast } = useToast();
    // Removed unused userToken to satisfy ESLint

    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Profile form
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        reset: resetProfile,
        control: controlProfile,
    } = useForm<ProfileFormData>({ mode: 'onChange' });
    // Removed unused watchProfile to satisfy ESLint

    // Password form
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors, isValid: isPasswordValid },
        watch: watchPassword,
        reset: resetPassword,
    } = useForm<PasswordFormData>({ mode: 'onChange' });

    const newPassword = watchPassword('newPassword', '');

    // Calculate password strength
    useEffect(() => {
        let strength = 0;
        if (newPassword.length >= 8) strength += 25;
        if (/[a-z]/.test(newPassword)) strength += 25;
        if (/[A-Z]/.test(newPassword)) strength += 25;
        if (/[0-9]/.test(newPassword)) strength += 15;
        if (/[#?!@$%^&*-]/.test(newPassword)) strength += 10;
        setPasswordStrength(strength);
    }, [newPassword]);

    // Load user data
    useEffect(() => {
        const loadUserData = async () => {
            setProfileLoading(true);
            try {
                const userData = userService.getMe();
                if (userData) {
                    const savedPhone = storage.get<string>('userPhone');
                    const savedGender = storage.get<'male' | 'female'>('userGender');
                    resetProfile({
                        name: userData.name || '',
                        email: userData.email || '',
                        phone: savedPhone || '',
                        gender: savedGender || 'male',
                    });
                }
                // Load saved profile image from localStorage using consistent key
                const savedImage = storage.get<string>('profilePhoto');
                if (savedImage) setProfileImage(savedImage);
            } finally {
                setProfileLoading(false);
            }
        };
        loadUserData();
    }, [resetProfile]);

    // Load orders when orders tab is active
    useEffect(() => {
        if (activeTab === 2 && orders.length === 0) {
            const loadOrders = async () => {
                setOrdersLoading(true);
                try {
                    const decoded = decodeToken();
                    if (decoded?.id) {
                        const data = await orderService.getUserOrders(decoded.id);
                        setOrders(data);
                    }
                } catch {
                    // Silently fail
                } finally {
                    setOrdersLoading(false);
                }
            };
            loadOrders();
        }
    }, [activeTab, orders.length]);

    // Orders loading removed addresses logic

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleProfileUpdate = async (data: ProfileFormData) => {
        setLoading(true);
        try {
            await userService.updateMe({
                name: data.name,
                phone: data.phone,
            }); // Exclude email from update as it's read-only and may cause failure if mismatching or empty
            storage.set('userPhone', data.phone);
            storage.set('userGender', data.gender);
            showToast(t('profile.updateSuccess') || 'Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch {
            showToast(t('profile.updateError') || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (data: PasswordFormData) => {
        setLoading(true);
        try {
            await authService.changePassword({
                currentPassword: data.currentPassword,
                password: data.newPassword,
                rePassword: data.confirmPassword,
            });
            showToast(t('profile.passwordChanged') || 'Password changed successfully!', 'success');
            resetPassword();
        } catch {
            showToast(t('profile.passwordError') || 'Failed to change password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setProfileImage(base64);
                storage.set('profilePhoto', base64);
                showToast(t('profile.photoUpdated') || 'Profile photo updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }, [showToast, t]);

    const getStrengthColor = () => {
        if (passwordStrength <= 30) return theme.palette.error.main;
        if (passwordStrength <= 60) return theme.palette.warning.main;
        return theme.palette.success.main;
    };

    const getStrengthLabel = () => {
        if (passwordStrength <= 30) return t('auth.weak') || 'Weak';
        if (passwordStrength <= 60) return t('auth.fair') || 'Fair';
        return t('auth.strong') || 'Strong';
    };

    const userData = userService.getMe();

    return (
        <>
            <PageMeta title={t('profile.title') || 'My Profile'} />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Header */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 3,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha(primaryColor, 0.1)} 0%, ${alpha(primaryColor, 0.05)} 100%)`,
                            border: `1px solid ${alpha(primaryColor, 0.2)}`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${alpha(primaryColor, 0.2)} 0%, transparent 70%)`,
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton
                                        component="label"
                                        sx={{
                                            bgcolor: primaryColor,
                                            color: '#fff',
                                            width: 36,
                                            height: 36,
                                            '&:hover': { bgcolor: alpha(primaryColor, 0.8) },
                                        }}
                                    >
                                        <CameraAlt fontSize="small" />
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </IconButton>
                                }
                            >
                                <Avatar
                                    src={profileImage || undefined}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        fontSize: '3rem',
                                        bgcolor: primaryColor,
                                        boxShadow: `0 8px 32px ${alpha(primaryColor, 0.4)}`,
                                        border: `4px solid ${theme.palette.background.paper}`,
                                    }}
                                >
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </Avatar>
                            </Badge>
                            <Box>
                                {profileLoading ? (
                                    <>
                                        <Skeleton width={200} height={40} />
                                        <Skeleton width={150} height={24} />
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h4" fontWeight={700} gutterBottom>
                                            {userData?.name || 'User'}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {userData?.email}
                                        </Typography>
                                        <Chip
                                            label={userData?.role || 'Member'}
                                            size="small"
                                            color="primary"
                                            sx={{ mt: 1, textTransform: 'capitalize' }}
                                        />
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    {/* Tabs Navigation */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: `1px solid ${theme.palette.divider}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                '& .MuiTab-root': {
                                    py: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                },
                            }}
                        >
                            <Tab icon={<Person />} iconPosition="start" label={t('profile.personalInfo') || 'Personal Info'} />
                            <Tab icon={<Lock />} iconPosition="start" label={t('profile.security') || 'Security'} />
                            <Tab icon={<ShoppingBag />} iconPosition="start" label={t('profile.orders') || 'Orders'} />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* Personal Info Tab */}
                            <TabPanel value={activeTab} index={0}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    {!isEditing ? (
                                        <Button
                                            startIcon={<Edit />}
                                            onClick={() => setIsEditing(true)}
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {t('common.edit') || 'Edit'}
                                        </Button>
                                    ) : (
                                        <Button
                                            startIcon={<Cancel />}
                                            onClick={() => setIsEditing(false)}
                                            color="inherit"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {t('common.cancel') || 'Cancel'}
                                        </Button>
                                    )}
                                </Box>

                                <form onSubmit={handleProfileSubmit(handleProfileUpdate)}>
                                    <Box sx={{ display: 'grid', gap: 3 }}>
                                        <TextField
                                            label={t('auth.fullNameLabel') || 'Full Name'}
                                            {...registerProfile('name', {
                                                required: t('auth.nameRequired') || 'Name is required',
                                                minLength: { value: 3, message: t('auth.nameMinLength') || 'Name must be at least 3 characters' },
                                                pattern: {
                                                    value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                                                    message: t('auth.nameInvalid') || 'Enter a valid name (letters only)'
                                                }
                                            })}
                                            error={!!profileErrors.name}
                                            helperText={profileErrors.name?.message}
                                            disabled={!isEditing || loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                        />
                                        <TextField
                                            label={t('auth.emailLabel') || 'Email'}
                                            type="email"
                                            {...registerProfile('email')}
                                            disabled={true} // Email cannot be changed
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input.Mui-disabled': {
                                                    WebkitTextFillColor: 'text.primary',
                                                    color: 'text.primary',
                                                    opacity: 0.8,
                                                },
                                            }}
                                            fullWidth
                                        />
                                        <Controller
                                            name="phone"
                                            control={controlProfile}
                                            rules={{
                                                required: t('auth.phoneRequired') || 'Phone is required',
                                            }}
                                            render={({ field }) => (
                                                <Box sx={{ position: 'relative', mb: 3 }}>
                                                    {/* Floating Label */}
                                                    <Typography
                                                        component="label"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -10,
                                                            left: 14,
                                                            px: 0.5,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            color: profileErrors.phone ? 'error.main' : 'text.secondary',
                                                            bgcolor: theme.palette.mode === 'dark'
                                                                ? 'rgba(15, 23, 42, 0.9)'
                                                                : 'background.paper',
                                                            zIndex: 1,
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        {t('auth.phoneLabel') || 'Phone Number'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                        {/* Phone Icon */}
                                                        <Phone
                                                            sx={{
                                                                position: 'absolute',
                                                                left: 14,
                                                                zIndex: 2,
                                                                color: 'action.active',
                                                                fontSize: '1.2rem',
                                                            }}
                                                        />
                                                        <PhoneInput
                                                            country={'eg'}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            disabled={!isEditing || loading}
                                                            inputStyle={{
                                                                width: '100%',
                                                                paddingLeft: '90px', // Space for icon + flag
                                                            }}
                                                            containerStyle={{ width: '100%' }}
                                                            placeholder={t('auth.phonePlaceholder') || 'Enter phone number'}
                                                            enableSearch={true}
                                                            masks={{ eg: '.. ... ....' }}
                                                            specialLabel=""
                                                        />
                                                    </Box>
                                                    {profileErrors.phone && (
                                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                                            {profileErrors.phone.message}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        />

                                        {/* Gender Display/Edit */}
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1, color: 'text.secondary', ml: 1 }}>
                                                {t('nav.gender')}
                                            </Typography>
                                            <Controller
                                                name="gender"
                                                control={controlProfile}
                                                render={({ field }) => (
                                                    <Stack direction="row" spacing={2}>
                                                        {[
                                                            { value: 'male', label: t('nav.male') },
                                                            { value: 'female', label: t('nav.female') }
                                                        ].map((option) => {
                                                            const active = field.value === option.value;
                                                            return (
                                                                <Box
                                                                    key={option.value}
                                                                    onClick={() => isEditing && field.onChange(option.value)}
                                                                    sx={{
                                                                        flex: 1, py: 1.5, px: 2,
                                                                        cursor: isEditing ? 'pointer' : 'default',
                                                                        borderRadius: '12px', textAlign: 'center',
                                                                        border: `2px solid ${active ? primaryColor : theme.palette.divider}`,
                                                                        bgcolor: active ? `${alpha(primaryColor, 0.1)}` : 'transparent',
                                                                        transition: 'all 0.3s ease', fontWeight: 700,
                                                                        color: active ? primaryColor : 'text.secondary',
                                                                        opacity: !isEditing && !active ? 0.5 : 1,
                                                                        '&:hover': {
                                                                            borderColor: isEditing ? (active ? primaryColor : alpha(primaryColor, 0.4)) : (active ? primaryColor : theme.palette.divider)
                                                                        }
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                </Box>
                                                            );
                                                        })}
                                                    </Stack>
                                                )}
                                            />
                                        </Box>

                                        {isEditing && (
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                                disabled={loading}
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: primaryColor,
                                                    '&:hover': { bgcolor: alpha(primaryColor, 0.9) },
                                                }}
                                            >
                                                {t('common.save') || 'Save Changes'}
                                            </Button>
                                        )}
                                    </Box>
                                </form>
                            </TabPanel>

                            {/* Security Tab */}
                            <TabPanel value={activeTab} index={1}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    {t('profile.changePassword') || 'Change Password'}
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <form onSubmit={handlePasswordSubmit(handlePasswordChange)}>
                                    <Box sx={{ display: 'grid', gap: 3 }}>
                                        <TextField
                                            label={t('auth.currentPassLabel') || 'Current Password'}
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            {...registerPassword('currentPassword', { required: 'Required' })}
                                            error={!!passwordErrors.currentPassword}
                                            helperText={passwordErrors.currentPassword?.message}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                        />

                                        <TextField
                                            label={t('auth.newPassLabel') || 'New Password'}
                                            type={showNewPassword ? 'text' : 'password'}
                                            {...registerPassword('newPassword', {
                                                required: 'Required',
                                                minLength: { value: 8, message: 'Min 8 characters' },
                                            })}
                                            error={!!passwordErrors.newPassword}
                                            helperText={passwordErrors.newPassword?.message}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                        />

                                        {newPassword && (
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {t('auth.strength') || 'Password Strength'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: getStrengthColor(), fontWeight: 'bold' }}>
                                                        {getStrengthLabel()}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={passwordStrength}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        bgcolor: theme.palette.action.hover,
                                                        '& .MuiLinearProgress-bar': { bgcolor: getStrengthColor() },
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        <TextField
                                            label={t('auth.confirmNewPass') || 'Confirm New Password'}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...registerPassword('confirmPassword', {
                                                required: 'Required',
                                                validate: (val) => val === newPassword || 'Passwords do not match',
                                            })}
                                            error={!!passwordErrors.confirmPassword}
                                            helperText={passwordErrors.confirmPassword?.message}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock />}
                                            disabled={loading || !isPasswordValid}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                bgcolor: primaryColor,
                                                '&:hover': { bgcolor: alpha(primaryColor, 0.9) },
                                            }}
                                        >
                                            {t('auth.changePassBtn') || 'Change Password'}
                                        </Button>
                                    </Box>
                                </form>
                            </TabPanel>

                            {/* Orders Tab */}
                            <TabPanel value={activeTab} index={2}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    {t('profile.orderHistory') || 'Order History'}
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                {ordersLoading ? (
                                    <Box sx={{ display: 'grid', gap: 2 }}>
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} variant="rounded" height={100} />
                                        ))}
                                    </Box>
                                ) : orders.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 6 }}>
                                        <ShoppingBag sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            {t('profile.noOrders') || 'No orders yet'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List>
                                        {orders.map((order) => (
                                            <Paper
                                                key={order._id}
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    mb: 2,
                                                    borderRadius: 2,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </Typography>
                                                    <Chip
                                                        icon={order.isDelivered ? <CheckCircle /> : <LocalShipping />}
                                                        label={order.isDelivered ? 'Delivered' : 'In Transit'}
                                                        color={order.isDelivered ? 'success' : 'warning'}
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Chip
                                                            icon={<Payment />}
                                                            label={order.isPaid ? 'Paid' : 'Pending'}
                                                            color={order.isPaid ? 'success' : 'default'}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {order.cartItems?.length || 0} items
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="h6" fontWeight={700} color={primaryColor}>
                                                        {order.totalOrderPrice?.toLocaleString()} EGP
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </List>
                                )}
                            </TabPanel>

                            {/* Addresses Tab Removed */}
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </>
    );
};

export default Profile;
