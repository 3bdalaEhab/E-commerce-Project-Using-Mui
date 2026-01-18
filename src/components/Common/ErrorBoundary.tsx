import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return <ErrorFallback onReset={this.handleReset} onHome={this.handleGoHome} />;
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ onReset, onHome }: { onReset: () => void; onHome: () => void }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                color: "text.primary",
                textAlign: "center",
                p: 3,
            }}
        >
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            p: 3,
                            borderRadius: "40px",
                            background: `linear-gradient(135deg, ${theme.palette.error.main}20, ${theme.palette.error.dark}40)`,
                            mb: 4,
                            border: `2px solid ${theme.palette.error.main}40`,
                        }}
                    >
                        <ErrorOutlineIcon sx={{ fontSize: "5rem", color: theme.palette.error.main }} />
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 1000,
                            mb: 2,
                            letterSpacing: "-2px",
                            background: `linear-gradient(to right, ${theme.palette.error.main}, ${theme.palette.error.light})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Something went wrong.
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 6, fontWeight: 500, lineHeight: 1.6, px: 4 }}
                    >
                        We've encountered an unexpected glitch in the matrix. Don't worry, our team is already on it.
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<RefreshIcon />}
                            onClick={onReset}
                            sx={{
                                borderRadius: "16px",
                                px: 5,
                                py: 2,
                                fontWeight: "900",
                                fontSize: "1.1rem",
                                bgcolor: theme.palette.error.main,
                                "&:hover": {
                                    bgcolor: theme.palette.error.dark,
                                    transform: "translateY(-4px)",
                                },
                                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            }}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={onHome}
                            sx={{
                                borderRadius: "16px",
                                px: 5,
                                py: 2,
                                fontWeight: "900",
                                fontSize: "1.1rem",
                                borderWidth: "2px",
                                "&:hover": {
                                    borderWidth: "2px",
                                    transform: "translateY(-4px)",
                                },
                                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ErrorBoundary;
