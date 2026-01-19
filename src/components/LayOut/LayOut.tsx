import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Drawer from "../Drawer/Drawer";
import Footer from "../Footer/Footer";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import TopProgressBar from "../Common/TopProgressBar";
import ThemeCustomizer from "../Common/ThemeCustomizer";
import ScrollToTop from "../Common/ScrollToTop";
import { QuickViewProvider } from "../../Context/QuickViewContext";
import QuickViewModal from "../Common/QuickViewModal"; // Use ViewFile to verify path if needed, but this is convention

export default function LayOut() {
    const location = useLocation();
    return (
        <QuickViewProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <TopProgressBar />
                <ThemeCustomizer />
                <Drawer />
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Outlet />
                </Box>
                <ScrollToTop />
                <QuickViewModal />
                <Footer />
            </Box>
        </QuickViewProvider>
    );
}
