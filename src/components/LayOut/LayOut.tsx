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
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ width: '100%', height: '100%' }} // Ensure full height
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </Box>
                <ScrollToTop />
                <QuickViewModal />
                <Footer />
            </Box>
        </QuickViewProvider>
    );
}
