import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

interface EmptyStateProps {
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    actionText = "Start Shopping",
    onAction,
    icon
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleAction = onAction || (() => navigate("/products"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 12,
                textAlign: "center",
                px: 3,
            }}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ marginBottom: "24px" }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "40px",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.palette.primary.main,
                        fontSize: "3rem",
                        border: `2px solid ${theme.palette.primary.main}20`,
                        backdropFilter: "blur(10px)",
                    }}
                >
                    {icon || <ShoppingBagOutlinedIcon sx={{ fontSize: "inherit" }} />}
                </Box>
            </motion.div>

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 1000,
                    mb: 1.5,
                    letterSpacing: "-1px",
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    maxWidth: 400,
                    mb: 5,
                    opacity: 0.8,
                    lineHeight: 1.6,
                }}
            >
                {description}
            </Typography>

            <Button
                variant="contained"
                size="large"
                onClick={handleAction}
                sx={{
                    borderRadius: "16px",
                    px: 6,
                    py: 2,
                    fontWeight: "900",
                    fontSize: "1.1rem",
                    boxShadow: `0 20px 40px ${theme.palette.primary.main}30`,
                    "&:hover": {
                        transform: "translateY(-4px) scale(1.05)",
                        boxShadow: `0 25px 50px ${theme.palette.primary.main}40`,
                    },
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
            >
                {actionText}
            </Button>
        </Box>
    );
};

export default EmptyState;
