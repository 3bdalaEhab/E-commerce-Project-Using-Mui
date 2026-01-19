import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    useTheme,
    Box,
    Typography,
    LinearProgress,
    Stack,
    Grid
} from "@mui/material";
import { Lock, Visibility, VisibilityOff, Email, Security, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../Context";
import { useThemeContext } from "../../Context/ThemeContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";
import { AxiosError } from "axios";

// Define ResetPasswordData if not in global types
interface ResetPasswordData {
    email: string;
    newPassword: string;
}

const ResetPassword: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { primaryColor } = useThemeContext();
    const theme = useTheme();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<ResetPasswordData & { confirmPassword: string }>({ mode: "onChange" });

    const newPassword = watch("newPassword", "");

    const calculateStrength = useCallback((pass: string) => {
        let s = 0;
        if (pass.length >= 8) s += 25;
        if (/[a-z]/.test(pass)) s += 25;
        if (/[A-Z]/.test(pass)) s += 25;
        if (/[0-9]/.test(pass)) s += 15;
        if (/[#?!@$%^&*-]/.test(pass)) s += 10;
        setStrength(s);
    }, []);

    useEffect(() => {
        calculateStrength(newPassword);
    }, [newPassword, calculateStrength]);

    const togglePassword = useCallback(() => setShowPassword((s) => !s), []);

    const onSubmit = async (formData: ResetPasswordData & { confirmPassword: string }) => {
        setLoading(true);
        try {
            await authService.resetPassword({
                email: formData.email.trim(),
                newPassword: formData.newPassword
            });

            showToast(t("toasts.resetSuccess"), "success");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const error = err as AxiosError<{ message?: string; error?: string }>;
            const msg = error.response?.data?.message || error.response?.data?.error || t("toasts.resetError");
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const strengthColor = strength <= 30 ? theme.palette.error.main : strength <= 60 ? theme.palette.warning.main : theme.palette.success.main;
    const strengthLabel = strength <= 30 ? t("auth.vulnerable") : strength <= 60 ? t("auth.secure") : t("auth.absoluteSecurity");

    return (
        <AuthLayout
            title={t("auth.restoreTitle")}
            subtitle={t("auth.restoreSubtitle")}
        >
            <Box sx={{ width: '100%', maxWidth: 450 }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    {t("auth.resetPassword")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t("auth.finalizeDesc")}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CustomTextField
                        label={t("auth.emailAccount")}
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

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label={t("auth.newPassLabel")}
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                                {...register("newPassword", {
                                    required: t("auth.passwordReq"),
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
                                        message: t("auth.complexityHint"),
                                    },
                                })}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
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

                        {newPassword && (
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mb: 2.5, px: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t("auth.securityLevel")}</Typography>
                                        <Typography variant="caption" sx={{ color: strengthColor, fontWeight: 800, textTransform: 'uppercase' }}>{strengthLabel}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={strength}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: `${strengthColor}15`,
                                            "& .MuiLinearProgress-bar": {
                                                bgcolor: strengthColor,
                                                borderRadius: 4,
                                                boxShadow: `0 0 10px ${strengthColor}40`
                                            }
                                        }}
                                    />
                                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                        {[
                                            { test: newPassword.length >= 8, label: t("auth.req8Chars") },
                                            { test: /[0-9]/.test(newPassword), label: t("auth.reqNumber") },
                                            { test: /[A-Z]/.test(newPassword), label: t("auth.reqUpper") },
                                            { test: /[#?!@$%^&*-]/.test(newPassword), label: t("auth.reqSpecial") }
                                        ].map((req, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    px: 1,
                                                    py: 0.2,
                                                    borderRadius: '4px',
                                                    bgcolor: req.test ? `${theme.palette.success.main}15` : 'transparent',
                                                    border: `1px solid ${req.test ? theme.palette.success.main : theme.palette.divider}`,
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <Typography variant="caption" sx={{ color: req.test ? theme.palette.success.main : theme.palette.text.disabled, fontWeight: 700, fontSize: '0.65rem' }}>
                                                    {req.label}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label={t("auth.confirmNewPass")}
                                type={showPassword ? "text" : "password"}
                                icon={Security}
                                {...register("confirmPassword", {
                                    required: t("auth.confirmReq"),
                                    validate: (val) => val === newPassword || t("auth.mismatch"),
                                })}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

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
                        {loading ? <CircularProgress size={24} color="inherit" /> : t("auth.resetBtn")}
                    </Button>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {t("auth.encryptedMsg")}
                        </Typography>
                    </Box>
                </form>
            </Box>
        </AuthLayout>
    );
};

export default ResetPassword;
