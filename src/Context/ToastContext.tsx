import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Snackbar, Alert, Slide, AlertColor, SlideProps } from '@mui/material';

// Types
type ToastSeverity = AlertColor;

interface ToastState {
    open: boolean;
    message: string;
    severity: ToastSeverity;
}

interface ToastContextType {
    showToast: (message: string, severity?: ToastSeverity) => void;
}

interface ToastProviderProps {
    children: ReactNode;
}

// Slide transition component
function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

// Create Context with proper typing
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: '',
        severity: 'info',
    });

    const showToast = useCallback((message: string, severity: ToastSeverity = 'info') => {
        setToast({ open: true, message, severity });
    }, []);

    const hideToast = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setToast((prev) => ({ ...prev, open: false }));
    }, []);

    // Memoize context value
    const contextValue = useMemo<ToastContextType>(
        () => ({ showToast }),
        [showToast]
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={hideToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={SlideTransition}
            >
                <Alert
                    onClose={hideToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        alignItems: 'center',
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
