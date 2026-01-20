import React from "react";
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Badge,
    useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Logout,
    Lock as LockIcon,
} from "@mui/icons-material";
import { useThemeContext, useAuth, useToast } from "../../Context";
import { storage } from "../../utils/storage";
import { logger } from "../../utils/logger";
import GlobalSearch from "../Common/GlobalSearch";
import { NavItem } from "./types";
import { pages } from "../../constants/pages";

interface MobileDrawerContentProps {
    navItems: NavItem[];
    handleDrawerToggle: () => void;
}

const MobileDrawerContent: React.FC<MobileDrawerContentProps> = ({
    navItems,
    handleDrawerToggle,
}) => {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const { userToken, setUserToken } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const logOut = () => {
        try {
            storage.remove("userToken");
            logger.info('User logged out', 'MobileDrawerContent');
        } catch (err) {
            logger.error("Logout error", 'MobileDrawerContent', err);
        }
        setUserToken(null);
        handleDrawerToggle();
        showToast(t("toasts.loggedOut"), "success");
        setTimeout(() => navigate("/login"), 1500);
    };

    return (
        <Box 
            sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}
        >
            {/* Header Section */}
            <Box 
                sx={{ 
                    textAlign: "center", 
                    p: 2,
                    flexShrink: 0
                }}
            >
                <Box onClick={handleDrawerToggle}>
                    <Typography
                        variant="h5"
                        sx={{
                            my: 2,
                            fontWeight: 900,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            cursor: "pointer"
                        }}
                    >
                        {t("footer.brandName")}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ px: 1 }}>
                    <GlobalSearch />
                </Box>
                <Divider sx={{ mt: 2 }} />
            </Box>

            {/* Scrollable Navigation */}
            <Box 
                sx={{ 
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    px: 2,
                    py: 1,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                        borderRadius: "10px",
                        "&:hover": {
                            backgroundColor: mode === "light" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                        },
                    },
                }}
            >
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                to={item.path || "#"}
                                onClick={handleDrawerToggle}
                                onTouchStart={() => {
                                    const pageKey = item.id.charAt(0).toUpperCase() + item.id.slice(1) as keyof typeof pages;
                                    if (pages[pageKey]) pages[pageKey]();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        bgcolor:
                                            mode === "light"
                                                ? "rgba(37, 99, 235, 0.08)"
                                                : "rgba(96, 165, 250, 0.12)",
                                        transform: "translateX(4px)",
                                    },
                                    "&:active": {
                                        transform: "scale(0.98)",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    minWidth: "40px", 
                                    color: theme.palette.primary.main 
                                }}>
                                    <Badge
                                        badgeContent={
                                            item.id === "cart"
                                                ? item.numItem
                                                : item.id === "wishlist"
                                                    ? item.numWishItem
                                                    : 0
                                        }
                                        color={item.id === "cart" ? "primary" : "secondary"}
                                        sx={{
                                            "& .MuiBadge-badge": {
                                                fontSize: "0.7rem",
                                                height: 18,
                                                minWidth: 18,
                                            },
                                        }}
                                    >
                                        {item.icon}
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{ 
                                        fontWeight: 600,
                                        fontSize: "0.95rem"
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {userToken && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    to="/change-password"
                                    onClick={handleDrawerToggle}
                                    sx={{ 
                                        borderRadius: 2,
                                        py: 1.5,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            bgcolor:
                                                mode === "light"
                                                    ? "rgba(37, 99, 235, 0.08)"
                                                    : "rgba(96, 165, 250, 0.12)",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ 
                                        minWidth: "40px",
                                        color: theme.palette.text.secondary
                                    }}>
                                        <LockIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={t("nav.settings")}
                                        primaryTypographyProps={{ 
                                            fontWeight: 600,
                                            fontSize: "0.95rem"
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={logOut}
                                    sx={{ 
                                        borderRadius: 2,
                                        py: 1.5,
                                        color: "error.main",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            bgcolor: "rgba(244, 67, 54, 0.08)",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ 
                                        minWidth: "40px", 
                                        color: "inherit" 
                                    }}>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={t("nav.logout")}
                                        primaryTypographyProps={{ 
                                            fontWeight: 600,
                                            fontSize: "0.95rem"
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>

            {/* Footer Section (optional) */}
            <Box 
                sx={{ 
                    flexShrink: 0,
                    p: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    textAlign: "center"
                }}
            >
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: theme.palette.text.secondary,
                        display: "block"
                    }}
                >
                    © 2026 {t("footer.brandName")}
                </Typography>
            </Box>
        </Box>
    );
};

export default MobileDrawerContent;
