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
    LinearProgress,
    Stack,
    Grid
} from "@mui/material";
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
import { useToast } from "../../Context";
import { useThemeContext } from "../../Context/ThemeContext";
import AuthLayout from "../../components/Common/AuthLayout";
import CustomTextField from "../../components/Common/CustomTextField";
import { authService } from "../../services";
import { RegisterCredentials } from "../../types";

const Register: React.FC = () => {
    const theme = useTheme();
    const { primaryColor } = useThemeContext();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<RegisterCredentials>({
        mode: "onChange",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = useCallback(() => setShowPassword((s) => !s), []);

    const handleSocialLogin = (platform: string) => {
        showToast(`🚀 ${platform} registration is coming soon! This part of the elite experience is currently in development.`, "info");
    };

    const onSubmit = async (formData: RegisterCredentials) => {
        setLoading(true);
        try {
            const res = await authService.register(formData);

            if (res.message === "success") {
                showToast("✅ Account created successfully! Welcome to the elite community.", "success");
                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error || "❌ Registration failed. Try again.";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join the Elite"
            subtitle="Become part of an exclusive world of premium products and unparalleled shopping experiences."
        >
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" fontWeight="1000" sx={{ mb: 1, letterSpacing: '-1px' }}>
                    Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Enter your details to start your journey.
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
                        OR FILL IN YOUR DETAILS
                    </Typography>
                </Divider>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* 👤 Name Field */}
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label="Full Name"
                                icon={Person}
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: { value: 3, message: "Min 3 characters" },
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={loading}
                            />
                        </Grid>

                        {/* 📧 Email Field */}
                        <Grid size={{ xs: 12 }}>
                            <CustomTextField
                                label="Email Address"
                                type="email"
                                icon={Email}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                        message: "Invalid email",
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
                                label="Phone Number"
                                icon={PhoneIcon}
                                {...register("phone", {
                                    required: "Phone is required",
                                    pattern: {
                                        value: /^01[0125][0-9]{8}$/,
                                        message: "Invalid Egyptian phone number",
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
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                                {...register("password", {
                                    required: "Password is required",
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/,
                                        message: "Complexity required",
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
                                label="Confirm"
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                                {...register("rePassword", {
                                    required: "Confirm required",
                                    validate: (value) => value === watch("password") || "Mismatch",
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Your Account"}
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
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: primaryColor,
                                fontWeight: 900,
                            }}
                        >
                            Sign In to Dashboard
                        </Link>
                    </Typography>
                </form>
            </Box>
        </AuthLayout>
    );
}

export default Register;
