import React, { useState, useCallback } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useForm } from "react-hook-form";
import {
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    useTheme,
    Divider,
    Box,
    Typography,
    Stack,
} from "@mui/material";
import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import {
    Email,
    Person,
    Lock,
    Visibility,
    VisibilityOff,
    Google
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../Context";
import { useThemeContext } from "../../Context/ThemeContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";
import { RegisterCredentials } from "../../types";
import { AxiosError } from "axios";
import storage from "../../utils/storage";
import { useSocialAuth } from "../../hooks/useSocialAuth";

const Register: React.FC = () => {
    const theme = useTheme();
    const { primaryColor } = useThemeContext();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();

    // Use the professional social auth hook
    const { handleSocialLogin, socialLoading } = useSocialAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        control,
    } = useForm<RegisterCredentials>({
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            rePassword: "",
            gender: "male"
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = useCallback(() => setShowPassword((s) => !s), []);


    const onSubmit = async (formData: RegisterCredentials) => {
        setLoading(true);
        try {
            const res = await authService.register(formData);

            if (res.message === "success") {
                showToast(t("auth.registerSuccess"), "success");
                storage.set("userPhone", formData.phone);
                storage.set("userGender", formData.gender);
                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string; error?: string }>;
            const msg = error.response?.data?.message || error.response?.data?.error || t("auth.registerError");
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={t("auth.joinEliteTitle")}
            subtitle={t("auth.registerSubtitle")}
        >
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    {t("auth.createAccount")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t("auth.startJourney")}
                </Typography>

                {/* 🌐 Social Registration (Elite Aesthetics) */}
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    {[
                        { icon: <Google />, name: 'Google', id: 'google' as const, color: '#EA4335', label: "Google" },
                    ].map((platform) => (
                        <IconButton
                            key={platform.name}
                            type="button"
                            onClick={() => handleSocialLogin(platform.id)}
                            disabled={socialLoading !== null}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                borderRadius: '16px',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                '&:hover': {
                                    bgcolor: `${platform.color}10`,
                                    borderColor: platform.color,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {socialLoading === platform.id ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Stack direction="row" alignItems="center" gap={1}>
                                    {React.cloneElement(platform.icon, { sx: { color: platform.color } })}
                                    <Typography fontWeight={600} fontSize="0.95rem">
                                        {platform.label}
                                    </Typography>
                                </Stack>
                            )}
                        </IconButton>
                    ))}
                </Stack>

                <Divider sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ px: 2, color: 'text.disabled', fontWeight: 700, letterSpacing: '1px' }}>
                        {t("auth.fillDetails")}
                    </Typography>
                </Divider>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* 👤 Name Field */}
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label={t("auth.fullNameLabel")}
                                icon={Person}
                                {...register("name", {
                                    required: t("auth.nameReq"),
                                    minLength: { value: 3, message: t("auth.nameMinLength") || "Name must be at least 3 characters" },
                                    pattern: {
                                        value: /^[a-zA-Z\s\u0600-\u06FF]+$/,
                                        message: t("auth.nameInvalid") || "Enter a valid name (letters only)"
                                    }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={loading}
                            />
                        </Grid>

                        {/* 📧 Email Field */}
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label={t("auth.emailLabel")}
                                type="email"
                                icon={Email}
                                {...register("email", {
                                    required: t("auth.emailReq"),
                                    pattern: {
                                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                        message: t("auth.invalidEmail"),
                                    },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={loading}
                            />
                        </Grid>

                        {/* � Password Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                label={t("auth.passwordLabel")}
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                                {...register("password", {
                                    required: t("auth.passwordReq"),
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
                                        message: t("auth.complexityReq"),
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* 🔒 Confirm Password Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <CustomTextField
                                label={t("auth.confirmPasswordLabel")}
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                                {...register("rePassword", {
                                    required: t("auth.confirmReq"),
                                    validate: (value) => value === watch("password") || t("auth.mismatch"),
                                })}
                                error={!!errors.rePassword}
                                helperText={errors.rePassword?.message}
                                disabled={loading}
                            />
                        </Grid>

                        {/* �📞 Phone Field */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: t("auth.phoneReq"),
                                    validate: (val) => val?.length >= 10 || t("auth.phoneInvalid") || "Enter a valid phone number"
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
                                                color: errors.phone ? 'error.main' : 'text.secondary',
                                                bgcolor: theme.palette.mode === 'dark'
                                                    ? 'rgba(15, 23, 42, 0.9)'
                                                    : 'background.paper',
                                                zIndex: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            {t("auth.phoneLabel")}
                                        </Typography>
                                        <PhoneInput
                                            country={'eg'}
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            disabled={loading}
                                            inputStyle={{ width: '100%' }}
                                            containerStyle={{ width: '100%' }}
                                            placeholder={t("auth.phonePlaceholder")}
                                            enableSearch={true}
                                            masks={{ eg: '.. ... ....' }}
                                            specialLabel=""
                                        />
                                        {errors.phone && (
                                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2, display: 'block' }}>
                                                {errors.phone.message}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            />
                        </Grid>

                        {/* 🚻 Gender Selection */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="gender"
                                control={control}
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
                                                color: 'text.secondary',
                                                bgcolor: theme.palette.mode === 'dark'
                                                    ? 'rgba(15, 23, 42, 0.9)'
                                                    : 'background.paper',
                                                zIndex: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            {t("nav.gender")}
                                        </Typography>
                                        <Box sx={{
                                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                                            borderRadius: '16px',
                                            p: 1.5,
                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                                        }}>
                                            <Stack direction="row" spacing={2}>
                                                {[
                                                    { value: 'male', label: t("nav.male") },
                                                    { value: 'female', label: t("nav.female") }
                                                ].map((option) => {
                                                    const active = field.value === option.value;
                                                    return (
                                                        <Box
                                                            key={option.value}
                                                            onClick={() => field.onChange(option.value)}
                                                            sx={{
                                                                flex: 1, py: 1.5, px: 2, cursor: 'pointer', borderRadius: '12px', textAlign: 'center',
                                                                border: `2px solid ${active ? primaryColor : theme.palette.divider}`,
                                                                bgcolor: active ? `${primaryColor}10` : 'transparent',
                                                                transition: 'all 0.3s ease', fontWeight: 800,
                                                                color: active ? primaryColor : 'text.secondary',
                                                                '&:hover': { borderColor: active ? primaryColor : primaryColor + '40' }
                                                            }}
                                                        >
                                                            {option.label}
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    </Box>
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* 🔘 Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading || !isValid}
                        variant="contained"
                        sx={{
                            mt: 2,
                            py: 2,
                            fontWeight: 900,
                            borderRadius: "16px",
                            fontSize: "1.1rem",
                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                            boxShadow: `0 8px 25px ${primaryColor}40`,
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: `0 12px 30px ${primaryColor}60`,
                            },
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : t("auth.createAccountButton")}
                    </Button>

                    {/* 📝 Login Link */}
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            mt: 4,
                            color: theme.palette.text.secondary,
                            fontWeight: 600
                        }}
                    >
                        {t("auth.hasAccount")}{" "}
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: primaryColor,
                                fontWeight: 900,
                            }}
                        >
                            {t("auth.signInDash")}
                        </Link>
                    </Typography>
                </form>
            </Box>
        </AuthLayout>
    );
}

export default Register;
