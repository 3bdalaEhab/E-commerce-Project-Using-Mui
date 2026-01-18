import React from "react";
import { Outlet } from "react-router-dom";
import Drawer from "../Drawer/Drawer";
import Footer from "../Footer/Footer";
import { Box } from "@mui/material";
import TopProgressBar from "../Common/TopProgressBar";
import ThemeCustomizer from "../Common/ThemeCustomizer";

export default function LayOut() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <TopProgressBar />
            <ThemeCustomizer />
            <Drawer />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
}
