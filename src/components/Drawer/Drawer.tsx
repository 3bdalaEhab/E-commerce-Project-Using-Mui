import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Tooltip, useTheme } from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  ShoppingCart,
  ListAlt,
  Favorite,
  Category,
  Login,
  AppRegistration,
  LightMode,
  Nightlight,
  Storefront,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { useAuth, CartContext, WishlistContext, useThemeContext } from "../../Context";

import UserMenu from "./UserMenu";
import DesktopNav from "./DesktopNav";
import MobileDrawerContent from "./MobileDrawerContent";
import LanguageSwitcher from "../Common/LanguageSwitcher";
import { NavItem } from "./types";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

interface DrawerAppBarProps {
  window?: () => Window;
}

const DrawerAppBar: React.FC<DrawerAppBarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const { userToken } = useAuth();
  const { numOfCartItems } = useContext(CartContext);
  const { numWishItemList } = useContext(WishlistContext);
  const { mode, toggleTheme } = useThemeContext();
  const { t } = useTranslation();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const navItems: NavItem[] = userToken
    ? [
      { id: "home", name: t("nav.home"), path: "/", icon: <Home /> },
      { id: "products", name: t("nav.products"), path: "/products", icon: <Storefront /> },
      { id: "categories", name: t("nav.categories"), path: "/categories", icon: <Category /> },
      {
        id: "wishlist",
        name: t("nav.wishlist"),
        path: "/wishlist",
        icon: <Favorite />,
        numWishItem: numWishItemList,
      },
      {
        id: "cart",
        name: t("nav.cart"),
        path: "/cart",
        icon: <ShoppingCart />,
        numItem: numOfCartItems,
      },
      { id: "orders", name: t("nav.orders"), path: "/allOrders", icon: <ListAlt /> },
    ]
    : [
      { id: "login", name: t("nav.login"), path: "/login", icon: <Login /> },
      { id: "register", name: t("nav.register"), path: "/register", icon: <AppRegistration /> },
    ];

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: 65 }}>
      <CssBaseline />

      <AppBar
        component="nav"
        position="fixed"
        sx={{
          backgroundColor:
            mode === "light"
              ? "rgba(255,255,255,0.8)"
              : "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ 
          gap: { xs: 0.5, sm: 1 },
          px: { xs: 1, sm: 2, md: 2, lg: 3 },
          minHeight: { xs: 56, sm: 64 },
          justifyContent: "space-between"
        }}>
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              display: { xs: "block", md: "none" },
              mr: 0.5,
              flexShrink: 0
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo - Fixed width, won't shrink */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexShrink: 0,
              fontWeight: 900,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
              textDecoration: "none",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" },
              whiteSpace: "nowrap",
              mr: { xs: 0.5, md: 1, lg: 2 },
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            {t("footer.brandName")}
          </Typography>

          {/* Desktop Navigation - Takes remaining space */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            minWidth: 0,
            overflow: "visible",
            mx: { md: 0.5, lg: 1 }
          }}>
            <DesktopNav navItems={navItems} />
          </Box>

          {/* Right Side Actions - Fixed, won't shrink */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 0.25, sm: 0.5, md: 1 },
            flexShrink: 0
          }}>
            <LanguageSwitcher />

            <Tooltip
              title={mode === "light" ? t("auth.switchToDark") : t("auth.switchToLight")}
            >
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  bgcolor:
                    mode === "light"
                      ? "rgba(0,0,0,0.04)"
                      : "rgba(255,255,255,0.05)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "rotate(20deg) scale(1.1)",
                    bgcolor:
                      mode === "light"
                        ? "rgba(0,0,0,0.08)"
                        : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {mode === "light" ? (
                  <Nightlight sx={{ color: "#475569", fontSize: { xs: "1.2rem", sm: "1.3rem" } }} />
                ) : (
                  <LightMode sx={{ color: "#fbbf24", fontSize: { xs: "1.2rem", sm: "1.3rem" } }} />
                )}
              </IconButton>
            </Tooltip>

            {userToken && <UserMenu />}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              height: "100vh",
            },
          }}
        >
          <MobileDrawerContent
            navItems={navItems}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Drawer>
      </Box>
    </Box>
  );
};

export default DrawerAppBar;
