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

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginCredentials>({
        mode: 'onChange',
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = useCallback(() => setShowPassword((s) => !s), []);

    const handleSocialLogin = (platform: string) => {
        showToast(`🚀 ${platform} integration is coming soon! This part of the elite experience is currently in development.`, "info");
    };

    const onSubmit = async (formData: LoginCredentials) => {
        setLoading(true);
        try {
            const res = await authService.login({ email: formData.email.trim(), password: formData.password });

            if (res.message === "success" && res.token) {
                showToast("✅ Welcome back! Logged in successfully.", "success");
                const token = res.token;
                setTimeout(() => {
                    storage.set("userToken", token);
                    setUserToken(token);
                    navigate("/");
                }, 1200);
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            const msg = error.response?.data?.message || "❌ Login failed. Please check your credentials.";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign In"
            subtitle="Access your premium dashboard and explore the global catalog of extraordinary products."
        >
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Please enter your details to continue.
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
                        OR CONTINUE WITH EMAIL
                    </Typography>
                </Divider>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* 📧 Email Field */}
                    <CustomTextField
                        label="Email Address"
                        type="email"
                        icon={Email}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Invalid email address",
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={loading}
                    />

                    {/* 🔒 Password Field */}
                    <CustomTextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        icon={Lock}
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "At least 8 characters" },
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
                            Forgot Password?
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In to Account"}
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
                        Don't have an account yet?{" "}
                        <Link
                            to="/register"
                            style={{
                                textDecoration: "none",
                                color: primaryColor,
                                fontWeight: 900,
                            }}
                        >
                            Join the Experience
                        </Link>
                    </Typography>
                </form>
            </Box>
        </AuthLayout>
    );
}

export default Login;
