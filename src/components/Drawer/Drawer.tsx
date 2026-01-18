import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Tooltip, useTheme } from "@mui/material";
import {
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  ShoppingCart,
  ListAlt,
  Favorite,
  Category,
  Login,
  AppRegistration,
  Logout,
  LightMode,
  Nightlight,
  Lock as LockIcon,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../../Context/tokenContext";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import { useThemeContext } from "../../Context/ThemeContext";
import { useToast } from "../../Context/ToastContext";

const drawerWidth = 240;

interface DrawerAppBarProps {
  window?: () => Window;
}

interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  numItem?: number;
  numWishItem?: number;
}

const DrawerAppBar: React.FC<DrawerAppBarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { showToast } = useToast();

  const { userToken, setUserToken } = useContext<any>(tokenContext);
  const { numOfCartItems } = useContext(CartContext);
  const { numWishItemList } = useContext(WishlistContext);
  const { mode, toggleTheme } = useThemeContext();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  function logOut() {
    try {
      localStorage.removeItem("userToken");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUserToken(null);
    handleMenuClose();
    showToast("Logged out successfully 👋", "success");
    setTimeout(() => navigate("/login"), 1500);
  }

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

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
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
        E-COMMERCE
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path || "#"}
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
                  badgeContent={item.name === "Cart" ? item.numItem : item.name === "Wishlist" ? item.numWishItem : 0}
                  color={item.name === "Cart" ? "primary" : "secondary"}
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
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={logOut} sx={{ borderRadius: 2, color: "error.main" }}>
                <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: 65 }}>
      <CssBaseline />

      <AppBar
        component="nav"
        position="fixed"
        sx={{
          backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          boxShadow: 'none'
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
              fontSize: '1.5rem',
              transition: 'transform 0.3s ease',
              "&:hover": {
                transform: "scale(1.02)",
              }
            }}
          >
            E-COMMERCE
          </Typography>

          <Tooltip title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor: mode === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                ml: 2,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "rotate(20deg) scale(1.1)",
                  bgcolor: mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)",
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

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
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
                  borderRadius: '12px',
                  textTransform: 'none',
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(96, 165, 250, 0.08)',
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                <Badge
                  badgeContent={item.name === "Cart" ? item.numItem : item.name === "Wishlist" ? item.numWishItem : 0}
                  color={item.name === "Cart" ? "primary" : "secondary"}
                  sx={{ "& .MuiBadge-badge": { fontSize: '0.65rem', height: 18, minWidth: 18, border: `2px solid ${theme.palette.background.paper}` } }}
                >
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                </Badge>
                {item.name}
              </Button>
            ))}

            {userToken && (
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    sx={{
                      ml: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: mode === 'light' ? '#f1f5f9' : '#1e293b',
                        borderColor: theme.palette.primary.main
                      }
                    }}
                    aria-controls={isMenuOpen ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      }}
                    >
                      U
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={isMenuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 200,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 1,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: theme.palette.background.paper,
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: mode === 'light' ? '#f1f5f9' : '#334155' }
                }}
              >
                <ListItemIcon>
                  <LockIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={600}>Change Password</Typography>
              </MenuItem>

              <Divider sx={{ my: 1, opacity: 0.6 }} />

              <MenuItem
                onClick={logOut}
                sx={{
                  py: 1.2,
                  px: 2,
                  borderRadius: 1.5,
                  color: 'error.main',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: mode === 'light' ? '#fef2f2' : 'rgba(239, 68, 68, 0.08)' }
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={600}>Logout</Typography>
              </MenuItem>
            </Menu>
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
          {drawer}
        </Drawer>
      </Box>

    </Box>
  );
};

export default DrawerAppBar;
