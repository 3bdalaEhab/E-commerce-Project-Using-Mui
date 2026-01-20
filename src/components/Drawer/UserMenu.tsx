import React, { useState } from "react";
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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Lock as LockIcon, Logout } from "@mui/icons-material";
import { useAuth, useThemeContext, useToast } from "../../Context";
import { storage } from "../../utils/storage";
import { logger } from "../../utils/logger";
import { useTranslation } from "react-i18next";

const UserMenu: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { mode } = useThemeContext();
    const { setUserToken } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation();

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
            storage.remove("userToken");
            logger.info('User logged out', 'UserMenu');
        } catch (err) {
            logger.error("Logout error", 'UserMenu', err);
        }
        setUserToken(null);
        handleMenuClose();
        showToast(t("toasts.loggedOut"), "success");
        setTimeout(() => navigate("/login"), 1500);
    };

    return (
        <>
            <Tooltip title={t("nav.settings")} arrow>
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
                        sx={{
                            width: { xs: 30, sm: 34 },
                            height: { xs: 30, sm: 34 },
                            bgcolor: theme.palette.primary.main,
                            fontSize: { xs: "0.85rem", sm: "0.95rem" },
                            fontWeight: 700,
                            transition: "all 0.3s ease",
                        }}
                    >
                        U
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
                        minWidth: 220,
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
                <MenuItem
                    component={Link}
                    to="/change-password"
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
                        <LockIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>
                        {t("auth.changePassTitle")}
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
