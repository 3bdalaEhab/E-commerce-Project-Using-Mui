import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "info", // "success" | "error" | "warning" | "info"
    });

    const showToast = useCallback((message, severity = "info") => {
        setToast({ open: true, message, severity });
    }, []);

    const hideToast = useCallback((event, reason) => {
        if (reason === "clickaway") return;
        setToast((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={hideToast}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                TransitionComponent={Slide}
            >
                <Alert
                    onClose={hideToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                        alignItems: "center",
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
