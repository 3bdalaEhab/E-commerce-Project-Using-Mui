import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Button,
    CircularProgress,
    Box,
    Typography
} from "@mui/material";
import { Email, ArrowBack } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../Context";
import { useThemeContext } from "../../Context/ThemeContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";
import { ForgotPasswordCredentials } from "../../types";
import { AxiosError } from "axios";

const ForgotPass: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { primaryColor } = useThemeContext();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordCredentials>({ mode: "onChange" });

    const onSubmit = async (formData: ForgotPasswordCredentials) => {
        setLoading(true);
        try {
            const res = await authService.forgotPassword({ email: formData.email.trim() });

            if (res.statusMsg === "success") {
                showToast(t("toasts.forgotSuccess"), "success");
                setTimeout(() => navigate("/VerifyResetCode"), 1500);
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string; error?: string }>;
            const msg = error.response?.data?.message || error.response?.data?.error || t("toasts.forgotError");
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={t("auth.recoveryTitle")}
            subtitle={t("auth.recoverySubtitle")}
        >
            <Box sx={{ width: '100%', maxWidth: 450 }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    {t("auth.forgotPass")}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t("auth.forgotDesc")}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
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

                    <Box
                        sx={{
                            mb: 4,
                            p: 2.5,
                            bgcolor: `${primaryColor}08`,
                            borderRadius: '16px',
                            border: `1px solid ${primaryColor}20`,
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                bgcolor: primaryColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            <Email sx={{ color: '#fff', fontSize: 20 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {t("auth.spamMsg")}
                        </Typography>
                    </Box>

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
                        {loading ? <CircularProgress size={24} color="inherit" /> : t("auth.sendCodeBtn")}
                    </Button>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: primaryColor,
                                fontWeight: 900,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}
                        >
                            <ArrowBack fontSize="small" /> {t("auth.backToLogin")}
                        </Link>
                    </Box>
                </form>
            </Box>
        </AuthLayout>
    );
};

export default ForgotPass;
