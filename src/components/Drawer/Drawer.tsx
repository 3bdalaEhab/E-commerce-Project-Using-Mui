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
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../../Context/tokenContext";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import { useThemeContext } from "../../Context/ThemeContext";

import UserMenu from "./UserMenu";
import DesktopNav from "./DesktopNav";
import MobileDrawerContent from "./MobileDrawerContent";
import { NavItem } from "./types";

const drawerWidth = 240;

interface DrawerAppBarProps {
  window?: () => Window;
}

const DrawerAppBar: React.FC<DrawerAppBarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const { userToken } = useContext<any>(tokenContext);
  const { numOfCartItems } = useContext(CartContext);
  const { numWishItemList } = useContext(WishlistContext);
  const { mode, toggleTheme } = useThemeContext();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const navItems: NavItem[] = userToken
    ? [
      { name: "Home", path: "/", icon: <Home /> },
      { name: "Categories", path: "/categories", icon: <Category /> },
      {
        name: "Wishlist",
        path: "/wishlist",
        icon: <Favorite />,
        numWishItem: numWishItemList,
      },
      {
        name: "Cart",
        path: "/cart",
        icon: <ShoppingCart />,
        numItem: numOfCartItems,
      },
      { name: "All Orders", path: "/allOrders", icon: <ListAlt /> },
    ]
    : [
      { name: "Login", path: "/login", icon: <Login /> },
      { name: "Register", path: "/register", icon: <AppRegistration /> },
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
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
              textDecoration: "none",
              fontSize: "1.5rem",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            E-COMMERCE
          </Typography>

          <Tooltip
            title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor:
                  mode === "light"
                    ? "rgba(0,0,0,0.04)"
                    : "rgba(255,255,255,0.05)",
                ml: 2,
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
                <Nightlight sx={{ color: "#475569" }} />
              ) : (
                <LightMode sx={{ color: "#fbbf24" }} />
              )}
            </IconButton>
          </Tooltip>

          <DesktopNav navItems={navItems} />

          {userToken && <UserMenu />}
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
