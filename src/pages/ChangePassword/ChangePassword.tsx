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
} from "@mui/material";
import { Lock, Visibility, VisibilityOff, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../Context";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";
import { ChangePasswordData } from "../../types";
import { AxiosError } from "axios";
import { storage } from "../../utils/storage";
import { logger } from "../../utils/logger";

const ChangePassword: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<ChangePasswordData>({ mode: "onChange" });

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
        calculateStrength(newPassword || "");
    }, [newPassword, calculateStrength]);

    const toggleCurrentPassword = useCallback(() => setShowCurrentPassword((s) => !s), []);
    const toggleNewPassword = useCallback(() => setShowNewPassword((s) => !s), []);
    const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((s) => !s), []);

    const onSubmit = async (formData: ChangePasswordData) => {
        setLoading(true);
        try {
            const res = await authService.changePassword({
                currentPassword: formData.password,
                password: formData.newPassword,
                rePassword: formData.passwordConfirm
            } as ChangePasswordData);

            if (res.token) storage.set("userToken", res.token);
            showToast(t("toasts.changeSuccess"), "success");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const error = err as AxiosError<{ message?: string; error?: string }>;
            const msg = error.response?.data?.message || error.response?.data?.error || t("toasts.changeError");
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        storage.remove("userToken");
        logger.info('User logged out', 'ChangePassword');
        navigate("/login");
    }, [navigate]);

    const strengthColor = strength <= 30 ? theme.palette.error.main : strength <= 60 ? theme.palette.warning.main : theme.palette.success.main;
    const strengthLabel = strength <= 30 ? t("auth.weak") : strength <= 60 ? t("auth.fair") : t("auth.strong");

    return (
        <AuthLayout
            title={t("auth.changePassTitle")}
            subtitle={t("auth.changePassSubtitle")}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <CustomTextField
                    label={t("auth.currentPassLabel")}
                    type={showCurrentPassword ? "text" : "password"}
                    icon={Lock}
                    {...register("password", { required: t("auth.passwordReq") })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleCurrentPassword} edge="end">
                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <CustomTextField
                    label={t("auth.newPassLabel")}
                    type={showNewPassword ? "text" : "password"}
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
                                <IconButton onClick={toggleNewPassword} edge="end">
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {newPassword && (
                    <Box sx={{ mb: 2.5, px: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">{t("auth.strength")}</Typography>
                            <Typography variant="caption" sx={{ color: strengthColor, fontWeight: "bold" }}>{strengthLabel}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={strength}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: theme.palette.action.hover,
                                "& .MuiLinearProgress-bar": { bgcolor: strengthColor }
                            }}
                        />
                    </Box>
                )}

                <CustomTextField
                    label={t("auth.confirmNewPass")}
                    type={showConfirmPassword ? "text" : "password"}
                    icon={Lock}
                    {...register("passwordConfirm", {
                        required: t("auth.confirmReq"),
                        validate: (val) => val === newPassword || t("auth.mismatch"),
                    })}
                    error={!!errors.passwordConfirm}
                    helperText={errors.passwordConfirm?.message}
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleConfirmPassword} edge="end">
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading || !isValid}
                    variant="contained"
                    sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: "12px",
                        background: loading ? "gray" : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: "#fff",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 20px ${theme.palette.primary.main}40` }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : `🔐 ${t("auth.changePassBtn")}`}
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Logout />}
                    onClick={logout}
                    sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: "bold",
                        color: theme.palette.text.secondary,
                        borderColor: theme.palette.divider,
                        "&:hover": { borderColor: theme.palette.error.main, color: theme.palette.error.main, bgcolor: "rgba(211, 47, 47, 0.04)" }
                    }}
                    disabled={loading}
                >
                    {t("auth.logoutSession")}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ChangePassword;
