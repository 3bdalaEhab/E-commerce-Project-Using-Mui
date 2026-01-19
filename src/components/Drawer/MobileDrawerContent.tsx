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
        handleDrawerToggle(); // Close drawer
        showToast(t("toasts.loggedOut"), "success");
        setTimeout(() => navigate("/login"), 1500);
    };

    return (
        <Box sx={{ textAlign: "center", p: 2 }}>
            <Box onClick={handleDrawerToggle}>
                <Typography
                    variant="h5"
                    sx={{
                        my: 2,
                        fontWeight: 900,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t("footer.brandName")}
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2, px: 1 }}>
                <GlobalSearch />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List onClick={handleDrawerToggle}>
                {navItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path || "#"}
                            onMouseEnter={() => {
                                const pageKey = item.id.charAt(0).toUpperCase() + item.id.slice(1) as keyof typeof pages;
                                if (pages[pageKey]) pages[pageKey]();
                            }}
                            onTouchStart={() => {
                                const pageKey = item.id.charAt(0).toUpperCase() + item.id.slice(1) as keyof typeof pages;
                                if (pages[pageKey]) pages[pageKey]();
                            }}
                            sx={{
                                borderRadius: 2,
                                "&:hover": {
                                    bgcolor:
                                        mode === "light"
                                            ? "rgba(37, 99, 235, 0.08)"
                                            : "rgba(96, 165, 250, 0.12)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: "40px", color: theme.palette.primary.main }}>
                                <Badge
                                    badgeContent={
                                        item.id === "cart"
                                            ? item.numItem
                                            : item.id === "wishlist"
                                                ? item.numWishItem
                                                : 0
                                    }
                                    color={item.id === "cart" ? "primary" : "secondary"}
                                >
                                    {item.icon}
                                </Badge>
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                primaryTypographyProps={{ fontWeight: 600 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                {userToken && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/change-password"
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: "40px" }}>
                                    <LockIcon />
                                </ListItemIcon>
                                <ListItemText primary={t("nav.settings")} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={logOut}
                                sx={{ borderRadius: 2, color: "error.main" }}
                            >
                                <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary={t("nav.logout")} />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );
};

export default MobileDrawerContent;
