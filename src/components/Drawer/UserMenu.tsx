import React, { useContext, useState } from "react";
import {
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Divider,
    useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Lock as LockIcon, Logout } from "@mui/icons-material";
import { tokenContext } from "../../Context/tokenContext";
import { useThemeContext } from "../../Context/ThemeContext";
import { useToast } from "../../Context/ToastContext";

const UserMenu: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { mode } = useThemeContext();
    const { setUserToken } = useContext<any>(tokenContext);
    const { showToast } = useToast();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const logOut = () => {
        try {
            localStorage.removeItem("userToken");
        } catch (err) {
            console.error("Logout error:", err);
        }
        setUserToken(null);
        handleMenuClose();
        showToast("Logged out successfully 👋", "success");
        setTimeout(() => navigate("/login"), 1500);
    };

    return (
        <>
            <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mx: 1, height: 24, alignSelf: "center" }}
                />
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleProfileMenuOpen}
                        size="small"
                        sx={{
                            ml: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                bgcolor: mode === "light" ? "#f1f5f9" : "#1e293b",
                                borderColor: theme.palette.primary.main,
                            },
                        }}
                        aria-controls={isMenuOpen ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen ? "true" : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: theme.palette.primary.main,
                                fontSize: "0.9rem",
                                fontWeight: 700,
                            }}
                        >
                            U
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isMenuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.15))",
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 200,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        p: 1,
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: theme.palette.background.paper,
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem
                    component={Link}
                    to="/change-password"
                    onClick={handleMenuClose}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: 1.5,
                        mb: 0.5,
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: mode === "light" ? "#f1f5f9" : "#334155" },
                    }}
                >
                    <ListItemIcon>
                        <LockIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>
                        Change Password
                    </Typography>
                </MenuItem>

                <Divider sx={{ my: 1, opacity: 0.6 }} />

                <MenuItem
                    onClick={logOut}
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: 1.5,
                        color: "error.main",
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: mode === "light" ? "#fef2f2" : "rgba(239, 68, 68, 0.08)",
                        },
                    }}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
