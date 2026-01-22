import React, { useState, useEffect } from "react";
import {
    Tooltip,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Divider,
    useTheme,
    Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
    Person as PersonIcon,
    Logout,
} from "@mui/icons-material";
import { useAuth, useThemeContext, useToast } from "../../Context";
import { storage } from "../../utils/storage";
import { logger } from "../../utils/logger";
import { useTranslation } from "react-i18next";
import { userService } from "../../services";

interface UserData {
    name: string;
    email: string;
    phone?: string;
}

const UserMenu: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { mode } = useThemeContext();
    const { userToken, setUserToken } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const isMenuOpen = Boolean(anchorEl);

    // Fetch user data on component mount
    useEffect(() => {
        if (userToken) {
            try {
                const user = userService.getMe();
                if (user) {
                    setUserData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: '',
                    });
                }
            } catch (error) {
                logger.error('Failed to fetch user data', 'UserMenu', error);
            }
        }
    }, [userToken]);

    // Listen for profile photo changes
    useEffect(() => {
        const checkProfilePhoto = () => {
            const photo = storage.get<string>('profilePhoto');
            setProfilePhoto(photo);
        };

        checkProfilePhoto();

        // Listen for storage changes
        const handleStorageChange = () => {
            checkProfilePhoto();
        };

        window.addEventListener('storage', handleStorageChange);
        // Also check periodically for same-tab updates
        const interval = setInterval(checkProfilePhoto, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const logOut = () => {
        try {
            storage.remove("userToken");
            storage.remove("profilePhoto");
            storage.remove("socialUser");
            logger.info('User logged out', 'UserMenu');
        } catch (err) {
            logger.error("Logout error", 'UserMenu', err);
        }
        setUserToken(null);
        handleMenuClose();
        showToast(t("toasts.loggedOut"), "success");
        setTimeout(() => navigate("/login"), 1500);
    };

    const getInitials = () => {
        if (userData?.name) {
            return userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return 'U';
    };

    return (
        <>
            <Tooltip title={t("nav.account") || "Account"} arrow>
                <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    sx={{
                        border: `1.5px solid ${isMenuOpen ? theme.palette.primary.main : theme.palette.divider}`,
                        transition: "all 0.3s ease",
                        ml: { xs: 0.5, sm: 1 },
                        p: 0.5,
                        "&:hover": {
                            bgcolor: mode === "light" ? "#f1f5f9" : "#1e293b",
                            borderColor: theme.palette.primary.main,
                            transform: "scale(1.05)",
                        },
                    }}
                    aria-controls={isMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                >
                    <Avatar
                        src={profilePhoto || undefined}
                        sx={{
                            width: { xs: 30, sm: 34 },
                            height: { xs: 30, sm: 34 },
                            bgcolor: theme.palette.primary.main,
                            fontSize: { xs: "0.85rem", sm: "0.95rem" },
                            fontWeight: 700,
                            transition: "all 0.3s ease",
                        }}
                    >
                        {!profilePhoto && getInitials()}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isMenuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.15))",
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 250,
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        p: 1,
                        "&::before": {
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
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ lineClamp: 1, overflow: 'hidden' }}>
                        {userData?.name || t("common.user") || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                        {userData?.email}
                    </Typography>
                </Box>

                <Divider sx={{ my: 0.5, opacity: 0.6 }} />

                {/* Account Link (Unified Profile & Settings) */}
                <MenuItem
                    component={Link}
                    to="/profile"
                    sx={{
                        py: 1.2,
                        px: 2,
                        borderRadius: 1.5,
                        mb: 0.5,
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: mode === "light" ? "#f1f5f9" : "#334155",
                            transform: "translateX(4px)"
                        },
                    }}
                >
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>
                        {t("nav.account") || "My Account"}
                    </Typography>
                </MenuItem>

                <Divider sx={{ my: 1, opacity: 0.6 }} />

                {/* Logout */}
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
                            transform: "translateX(4px)"
                        },
                    }}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>
                        {t("nav.logout")}
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;

