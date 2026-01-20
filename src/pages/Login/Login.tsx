import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    useTheme,
    Box,
    Typography,
    Divider,
    Stack
} from "@mui/material";
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Google,
    GitHub,
    Apple
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth, useToast } from "../../Context";
import { useThemeContext } from "../../Context/ThemeContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";
import { LoginCredentials } from "../../types";
import { AxiosError } from "axios";
import storage from "@/utils/storage";

const Login: React.FC = () => {
    const { setUserToken } = useAuth();
    const { primaryColor } = useThemeContext();
    const theme = useTheme();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginCredentials>({
        mode: 'onChange',
        defaultValues: {
            email: "Abdalaehab3@gmail.com",
            password: "123123Ae***"
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = useCallback(() => setShowPassword((s) => !s), []);

    const handleSocialLogin = (platform: string) => {
        showToast(`🚀 ${platform} ${t("auth.socialComingSoon")}`, "info");
    };

    const onSubmit = async (formData: LoginCredentials) => {
        setLoading(true);
        try {
            const res = await authService.login({ email: formData.email.trim(), password: formData.password });

            if (res.message === "success" && res.token) {
                showToast(t("auth.loginSuccess"), "success");
                const token = res.token;
                storage.set("userToken", token);
                setUserToken(token);
                navigate("/");
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            const msg = error.response?.data?.message || t("auth.loginError");
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={t("auth.signInTitle")}
            subtitle={t("auth.signInSubtitle")}
        >
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    {t("auth.welcomeBack")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t("auth.enterDetails")}
                </Typography>

                {/* 🌐 Social Logins (Enterprise Aesthetics) */}
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
                        {t("auth.continueWithEmail")}
                    </Typography>
                </Divider>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* 📧 Email Field */}
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

                    {/* 🔒 Password Field */}
                    <CustomTextField
                        label={t("auth.passwordLabel")}
                        type={showPassword ? "text" : "password"}
                        icon={Lock}
                        {...register("password", {
                            required: t("auth.passwordReq"),
                            minLength: { value: 8, message: t("auth.minChar") },
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

                    {/* 🔗 Forgot Password Link */}
                    <Box sx={{ mb: 4, textAlign: "right" }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                textDecoration: "none",
                                color: primaryColor,
                                fontSize: "0.875rem",
                                fontWeight: 700,
                            }}
                        >
                            {t("auth.forgotPassword")}
                        </Link>
                    </Box>

                    {/* 🔘 Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading || !isValid}
                        variant="contained"
                        sx={{
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : t("auth.signInButton")}
                    </Button>

                    {/* 📝 Sign Up Link */}
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            mt: 4,
                            color: theme.palette.text.secondary,
                            fontWeight: 600
                        }}
                    >
                        {t("auth.noAccount")}{" "}
                        <Link
                            to="/register"
                            style={{
                                textDecoration: "none",
                                color: primaryColor,
                                fontWeight: 900,
                            }}
                        >
                            {t("auth.joinExperience")}
                        </Link>
                    </Typography>
                </form>
            </Box>
        </AuthLayout>
    );
}

export default Login;
