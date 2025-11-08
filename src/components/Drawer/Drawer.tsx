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
import { Snackbar, Alert, Tooltip } from "@mui/material";
import {
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
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../../Context/tokenContext";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext";
import { useThemeContext } from "../../Context/ThemeContext";

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
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const { userToken, setUserToken } = useContext(tokenContext);
  const { numOfCartItems } = useContext(CartContext);
  const { numWishItemList } = useContext(WishlistContext);
  const { mode, toggleTheme } = useThemeContext();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  function logOut() {
    try {
      localStorage.removeItem("userToken");
    } catch (err) {
      console.error("Failed to remove token:", err);
    }
    setUserToken(null);
    setOpen(true);
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
        { name: "LogOut", icon: <Logout /> },
      ]
    : [
        { name: "Login", path: "/login", icon: <Login /> },
        { name: "Register", path: "/register", icon: <AppRegistration /> },
      ];

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
              <ListItemButton component={Link} to={item.path || "#"} sx={{ textAlign: "center" }}>
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {item.icon}
                  {item.name === "Cart" && (
                    <Box
                      sx={{
                        ml: 0.5,
                        bgcolor: "green",
                        color: "white",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.numItem > 9 ? "9+" : item.numItem ?? 0}
                    </Box>
                  )}
                  {item.name === "Wishlist" && (
                    <Box
                      sx={{
                        ml: 0.5,
                        bgcolor: "red",
                        color: "white",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.numWishItem > 9 ? "9+" : item.numWishItem ?? 0}
                    </Box>
                  )}
                </ListItemIcon>
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

      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon sx={{ mt: 1 }} />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MUI App 
          </Typography>


   <Tooltip title={mode === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "#fff",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            color: mode === "light" ? "#44433dff" : "#e9d30aff", 
          },
        }}
      >
        {mode === "light" ? <Nightlight /> : <LightMode />}
      </IconButton>
    </Tooltip>









          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {navItems.map((item) =>
              item.name === "LogOut" ? (
                <Button key={item.name} onClick={logOut} sx={{ color: "#fff" }} startIcon={item.icon}>
                  {item.name}
                </Button>
              ) : (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path || "#"}
                  sx={{ color: "#fff", position: "relative" }}
                  startIcon={item.icon}
                >
                  {item.name}
                  {item.name === "Cart" && (
                    <Box
                      sx={{
                        ml: 0.5,
                        color: "white",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.numItem > 9 ? "9+" : item.numItem ?? 0}
                    </Box>
                  )}
                  {item.name === "Wishlist" && (
                    <Box
                      sx={{
                        ml: 0.5,
                        color: "white",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.numWishItem > 9 ? "9+" : item.numWishItem ?? 0}
                    </Box>
                  )}
                </Button>
              )
            )}
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

      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleClose}>
          Logged out successfully 👋
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DrawerAppBar;
