import React, { useState, useCallback } from "react";
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
import Grid from "@mui/material/Grid";
import {
    Email,
    Person,
    Lock,
    Visibility,
    VisibilityOff,
    Phone as PhoneIcon,
    Google,
    GitHub,
    Apple
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

const Register: React.FC = () => {
    const theme = useTheme();
    const { primaryColor } = useThemeContext();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<RegisterCredentials>({
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            rePassword: ""
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = useCallback(() => setShowPassword((s) => !s), []);

    const handleSocialLogin = (platform: string) => {
        showToast(`🚀 ${platform} ${t("auth.socialComingSoon")}`, "info");
    };

    const onSubmit = async (formData: RegisterCredentials) => {
        setLoading(true);
        try {
            const res = await authService.register(formData);

            if (res.message === "success") {
                showToast(t("auth.registerSuccess"), "success");
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
                        { icon: <Google />, name: 'Google' },
                        { icon: <Apple />, name: 'Apple' },
                        { icon: <GitHub />, name: 'GitHub' }
                    ].map((platform) => (
                        <IconButton
                            key={platform.name}
                            type="button"
                            onClick={() => handleSocialLogin(platform.name)}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                borderRadius: '16px',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: `${primaryColor}10`,
                                    borderColor: primaryColor,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {platform.icon}
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
                                    minLength: { value: 3, message: t("auth.min3Char") },
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

                        {/* 📞 Phone Field */}
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label={t("auth.phoneLabel")}
                                icon={PhoneIcon}
                                {...register("phone", {
                                    required: t("auth.phoneReq"),
                                    pattern: {
                                        value: /^01[0125][0-9]{8}$/,
                                        message: t("auth.invalidPhone"),
                                    },
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                disabled={loading}
                            />
                        </Grid>

                        {/* 🔒 Password Field */}
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
