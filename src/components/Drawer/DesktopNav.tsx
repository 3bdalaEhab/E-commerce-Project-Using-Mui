import React from "react";
import { Box, Button, Badge, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../Context";
import GlobalSearch from "../Common/GlobalSearch";
import { NavItem } from "./types";
import { pages } from "../../constants/pages";

interface DesktopNavProps {
    navItems: NavItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <Box 
            sx={{ 
                display: "flex",
                alignItems: "center", 
                gap: { md: 0.5, lg: 1, xl: 1.5 },
                width: "100%",
                maxWidth: "100%",
                overflow: "visible"
            }}
        >
            {/* Search Box with guaranteed minimum width */}
            <Box sx={{ 
                flexShrink: 1,
                minWidth: { md: "180px", lg: "220px", xl: "280px" },
                maxWidth: { md: "220px", lg: "280px", xl: "350px" }
            }}>
                <GlobalSearch />
            </Box>
            
            {/* Navigation Buttons - flexible but won't push search */}
            <Box sx={{ 
                display: "flex",
                alignItems: "center",
                gap: { md: 0.2, lg: 0.5, xl: 1 },
                flexWrap: "nowrap",
                flexShrink: 1,
                minWidth: 0,
                overflow: "visible"
            }}>
                {navItems.map((item) => (
                    <Button
                        key={item.name}
                        component={Link}
                        to={item.path || "#"}
                        onMouseEnter={() => {
                            const pageKey = item.id.charAt(0).toUpperCase() + item.id.slice(1) as keyof typeof pages;
                            if (pages[pageKey]) {
                                pages[pageKey]();
                            }
                        }}
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            fontSize: { 
                                md: "0.7rem", 
                                lg: "0.8rem",
                                xl: "0.9rem"
                            },
                            px: { 
                                md: 0.75, 
                                lg: 1.2,
                                xl: 2
                            },
                            py: { md: 0.8, lg: 1 },
                            borderRadius: "12px",
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            minWidth: "auto",
                            flexShrink: 1,
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
                                item.id === "cart"
                                    ? item.numItem
                                    : item.id === "wishlist"
                                        ? item.numWishItem
                                        : 0
                            }
                            color={item.id === "cart" ? "primary" : "secondary"}
                            sx={{
                                "& .MuiBadge-badge": {
                                    fontSize: "0.65rem",
                                    height: 18,
                                    minWidth: 18,
                                    border: `2px solid ${theme.palette.background.paper}`,
                                },
                            }}
                        >
                            <Box sx={{ 
                                mr: { md: 0.3, lg: 0.5 }, 
                                display: "flex", 
                                alignItems: "center",
                                fontSize: { md: "1.1rem", lg: "1.2rem" }
                            }}>
                                {item.icon}
                            </Box>
                        </Badge>
                        {/* Hide text on medium screens if needed, show on large+ */}
                        <Box component="span" sx={{ 
                            display: { 
                                md: isLargeScreen || navItems.length <= 4 ? "inline" : "none", 
                                lg: "inline" 
                            } 
                        }}>
                            {item.name}
                        </Box>
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default DesktopNav;
