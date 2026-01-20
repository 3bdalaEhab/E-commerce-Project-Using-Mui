import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Drawer from "../Drawer/Drawer";
import Footer from "../Footer/Footer";
import { Box } from "@mui/material";
import TopProgressBar from "../Common/TopProgressBar";
import ThemeCustomizer from "../Common/ThemeCustomizer";
import ScrollToTop from "../Common/ScrollToTop";
import { QuickViewProvider } from "../../Context/QuickViewContext";
import QuickViewModal from "../Common/QuickViewModal";
import { AnimatePresence } from "framer-motion";

export default function LayOut() {
    const location = useLocation();

    return (
        <QuickViewProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
                <TopProgressBar />
                <ThemeCustomizer />
                <Drawer />
                <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
                    <Box sx={{ width: '100%' }}>
                        <Outlet />
                    </Box>
                </Box>
                <ScrollToTop />
                <QuickViewModal />
                <Footer />
            </Box>
        </QuickViewProvider>
    );
}
