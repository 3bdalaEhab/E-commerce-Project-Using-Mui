import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';

// Types
interface ThemeContextType {
    mode: PaletteMode;
    toggleTheme: () => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
}

interface ThemeContextProviderProps {
    children: ReactNode;
}

// Create Context with proper typing
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Design tokens function with proper typing
const getDesignTokens = (mode: PaletteMode, primaryColor: string) => ({
    palette: {
        mode,
        primary: {
            main: primaryColor,
            light: primaryColor + '99', // Transparent version
            dark: primaryColor,
        },
        ...(mode === 'light'
            ? {
                secondary: {
                    main: '#7c3aed', // Modern Violet
                },
                background: {
                    default: '#fdfdfe', // Clean Pearl
                    paper: '#ffffff',
                },
                text: {
                    primary: '#0f172a',
                    secondary: '#475569',
                },
                divider: 'rgba(0, 0, 0, 0.05)',
                accent: {
                    main: '#f59e0b',
                }
            }
            : {
                secondary: {
                    main: '#8b5cf6',
                },
                background: {
                    default: '#020617', // Midnight Black
                    paper: '#0f172a', // Navy Slate
                },
                text: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                },
                divider: 'rgba(255, 255, 255, 0.06)',
                accent: {
                    main: '#fbbf24',
                }
            }),
    },
    shadows: [
        'none',
        '0 2px 4px rgba(0,0,0,0.02)',
        '0 4px 6px rgba(0,0,0,0.03)',
        '0 10px 15px rgba(0,0,0,0.04)',
        '0 20px 25px rgba(0,0,0,0.05)',
        '0 25px 50px rgba(0,0,0,0.1)', // md
        '0 35px 60px rgba(0,0,0,0.15)', // lg
        '0 50px 100px rgba(0,0,0,0.2)', // xl
        ...Array(17).fill('none'), // Mocking rest for safety
    ] as Theme['shadows'],
    typography: {
        fontFamily: "'Outfit', 'Cairo', 'Inter', sans-serif",
        h1: { fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
        h2: { fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
        h3: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
        h4: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.4 },
        h5: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.5 },
        h6: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.6 },
        subtitle1: { fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6, letterSpacing: '0.01em' },
        subtitle2: { fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6, letterSpacing: '0.01em' },
        body1: { fontSize: '1rem', lineHeight: 1.7, fontWeight: 400 },
        body2: { fontSize: '0.875rem', lineHeight: 1.7, fontWeight: 400 },
        button: { textTransform: 'none' as const, fontWeight: 600, letterSpacing: '0.02em', fontSize: '1rem' },
        caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.02em' },
    },
    shape: {
        borderRadius: 20,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollBehavior: 'smooth',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-track': { background: mode === 'light' ? '#f1f5f9' : '#020617' },
                    '&::-webkit-scrollbar-thumb': {
                        background: mode === 'light' ? '#cbd5e1' : '#334155',
                        borderRadius: '10px'
                    },
                    backgroundImage: mode === 'light'
                        ? 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px)'
                        : 'radial-gradient(#1e293b 0.5px, transparent 0.5px)',
                    backgroundSize: '30px 30px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    padding: '10px 24px',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: 'none',
                    '&:hover': {
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: mode === 'light'
                            ? `0 10px 20px -10px ${primaryColor}80`
                            : `0 10px 25px -10px ${primaryColor}80`,
                    },
                    '&:active': {
                        transform: 'translateY(1px) scale(0.98)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    transition: 'all 0.4s ease',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    border: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
                    backgroundColor: mode === 'light' ? '#fff' : 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(2, 6, 23, 0.8)',
                    backdropFilter: 'blur(16px)',
                    color: mode === 'light' ? '#0f172a' : '#f8fafc',
                    boxShadow: 'none',
                    borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                },
            },
        },
    },
});

export default function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = storage.get<PaletteMode>('themeMode');
        if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
            return savedMode;
        }
        return prefersDarkMode ? 'dark' : 'light';
    });

    const [primaryColor, setPrimaryColor] = useState<string>(() => {
        return storage.get<string>('primaryColor') || '#2563eb';
    });

    useEffect(() => {
        storage.set('themeMode', mode);
        document.body.setAttribute('data-theme', mode);
        logger.debug(`Theme mode changed to: ${mode}`, 'ThemeContext');
    }, [mode]);

    useEffect(() => {
        storage.set('primaryColor', primaryColor);
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        logger.debug(`Primary color changed to: ${primaryColor}`, 'ThemeContext');
    }, [primaryColor]);

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo<Theme>(() => createTheme(getDesignTokens(mode, primaryColor)), [mode, primaryColor]);

    // Memoize context value
    const contextValue = useMemo<ThemeContextType>(
        () => ({ mode, toggleTheme, primaryColor, setPrimaryColor }),
        [mode, primaryColor]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
};
