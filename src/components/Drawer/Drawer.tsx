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
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Snackbar, Alert } from "@mui/material";
import {
  Home,
  ShoppingCart,
  ListAlt,
  Favorite,
  Category,
  Login,
  AppRegistration,
  Logout,
  ProductionQuantityLimitsSharp,
  ProductionQuantityLimitsTwoTone,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../../Context/tokenContext";

const drawerWidth = 240;

interface DrawerAppBarProps {
  window?: () => Window;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const DrawerAppBar: React.FC<DrawerAppBarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const { userToken, setUserToken } = useContext(tokenContext);
  const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);

  // Handle user logout
  function logOut() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setOpen(true); // show the snackbar
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }
  // Navigation items depending on login state
  const navItems: NavItem[] = userToken
    ? [
      { name: "Home", path: "/", icon: <Home /> },
      { name: "Categories", path: "/categories", icon: <Category /> },
      { name: "Wishlist", path: "/wishlist", icon: <Favorite /> },
      // { name: "products", path: "/products", icon: <ProductionQuantityLimitsTwoTone /> },
      { name: "Cart", path: "/cart", icon: <ShoppingCart /> },
      { name: "All Orders", path: "/allOrders", icon: <ListAlt /> },
      { name: "LogOut", path: "", icon: <Logout /> },
    ]
    : [
      { name: "Login", path: "/login", icon: <Login /> },
      { name: "Register", path: "/register", icon: <AppRegistration /> },
    ];

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  // Drawer (mobile view)
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI App
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            {item.name === "LogOut" ? (
              <ListItemButton onClick={logOut} sx={{ textAlign: "center" }}>
                <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{ textAlign: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: 65 }}>
      <CssBaseline />
      {/* Top Navigation Bar */}
      <AppBar component="nav">
        <Toolbar>
          {/* Menu button for mobile view */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon sx={{ mt: 1 }} />
          </IconButton>

          {/* App Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MUI App
          </Typography>

          {/* Navigation buttons (desktop view) */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) =>
              item.name === "LogOut" ? (
                <Button
                  key={item.name}
                  onClick={logOut}
                  sx={{ color: "#fff" }}
                  startIcon={item.icon}
                >
                  {item.name}
                </Button>
              ) : (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{ color: "#fff" }}
                  startIcon={item.icon}
                >
                  {item.name}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (for small screens) */}
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
              height: "100vh", // keep full height
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Content area */}
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose}>
          Logged out successfully 👋
        </Alert>
      </Snackbar>
      
    </Box>
  );
};

export default DrawerAppBar;
