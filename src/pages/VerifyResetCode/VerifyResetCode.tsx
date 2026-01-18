import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Button,
    CircularProgress,
    useTheme,
    Box,
    Typography,
    Stack
} from "@mui/material";
import { VerifiedUser, ArrowBack } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../Context";
import { useThemeContext } from "../../Context/ThemeContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";

const VerifyResetCode: React.FC = () => {
    const navigate = useNavigate();
    const { primaryColor } = useThemeContext();
    const theme = useTheme();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<{ resetCode: string }>({ mode: "onChange" });

    const onSubmit = async (formData: { resetCode: string }) => {
        setLoading(true);
        try {
            const res = await authService.verifyResetCode({ resetCode: formData.resetCode.trim() });

            if (res.status === "Success" || res.status === "success" || res.status === 200) {
                showToast("✅ Code verified successfully! System unlocked.", "success");
                setTimeout(() => navigate("/ResetPassword"), 1500);
            } else {
                showToast("❌ Unexpected response from server. Please try again.", "error");
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || "❌ Verification failed. Code may be invalid.";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Secure Verification"
            subtitle="Validate your identity by entering the high-entropy reset code dispatched to your email."
        >
            <Box sx={{ width: '100%', maxWidth: 450 }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    Verify Identity
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Please enter the 6-digit verification code.
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CustomTextField
                        label="Verification Code"
                        type="text"
                        icon={VerifiedUser}
                        {...register("resetCode", {
                            required: "Reset code is required",
                            pattern: {
                                value: /^[0-9]{6}$/,
                                message: "Code must be 6 digits",
                            }
                        })}
                        error={!!errors.resetCode}
                        helperText={errors.resetCode?.message}
                        disabled={loading}
                        inputProps={{ maxLength: 6, style: { fontSize: '1.2rem', letterSpacing: '4px', textAlign: 'center' } }}
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
                            <VerifiedUser sx={{ color: '#fff', fontSize: 20 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            This code will expire shortly for your security.
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "🎯 Verify Reset Code"}
                    </Button>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Link
                            to="/forgot-password"
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
                            <ArrowBack fontSize="small" /> Back to Recovery
                        </Link>
                    </Box>
                </form>
            </Box>
        </AuthLayout>
    );
};

export default VerifyResetCode;
