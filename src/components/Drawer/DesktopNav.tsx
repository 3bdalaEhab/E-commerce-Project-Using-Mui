import React from "react";
import { Box, Button, Badge, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useThemeContext } from "../../Context";
import GlobalSearch from "../Common/GlobalSearch";
import { NavItem } from "./types";

interface DesktopNavProps {
    navItems: NavItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <GlobalSearch />
            {navItems.map((item) => (
                <Button
                    key={item.name}
                    component={Link}
                    to={item.path || "#"}
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        px: 2,
                        py: 1.2,
                        borderRadius: "12px",
                        textTransform: "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            color: theme.palette.primary.main,
                            backgroundColor:
                                mode === "light"
                                    ? "rgba(37, 99, 235, 0.04)"
                                    : "rgba(96, 165, 250, 0.08)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <Badge
                        badgeContent={
                            item.name === "Cart"
                                ? item.numItem
                                : item.name === "Wishlist"
                                    ? item.numWishItem
                                    : 0
                        }
                        color={item.name === "Cart" ? "primary" : "secondary"}
                        sx={{
                            "& .MuiBadge-badge": {
                                fontSize: "0.65rem",
                                height: 18,
                                minWidth: 18,
                                border: `2px solid ${theme.palette.background.paper}`,
                            },
                        }}
                    >
                        <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                            {item.icon}
                        </Box>
                    </Badge>
                    {item.name}
                </Button>
            ))}

        </Box>
    );
};

export default DesktopNav;
