import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

const ThemeContext = createContext();

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
        // ✨ Premium Light Mode Palette
        primary: {
          main: "#2563eb", // Deep Blue
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        secondary: {
          main: "#7c3aed", // Indigo/Violet
        },
        background: {
          default: "#f8fafc", // Very Light Slate
          paper: "#ffffff",
        },
        text: {
          primary: "#0f172a", // Dark Slate
          secondary: "#475569", // Medium Slate
        },
        divider: "rgba(0, 0, 0, 0.08)",
      }
      : {
        // 🌙 Professional Dark Mode Palette (Glassmorphism inspired)
        primary: {
          main: "#60a5fa", // Soft Sky Blue
          light: "#93c5fd",
          dark: "#2563eb",
        },
        secondary: {
          main: "#a78bfa", // Soft Violet
        },
        background: {
          default: "#0f172a", // Very Dark Slate
          paper: "#1e293b",    // Dark Slate
        },
        text: {
          primary: "#f8fafc", // Ghost White
          secondary: "#94a3b8", // Muted Slate
        },
        divider: "rgba(255, 255, 255, 0.12)",
      }),
  },
  typography: {
    fontFamily: "'Cairo', 'Outfit', 'Roboto', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0 4px 20px rgba(0,0,0,0.05)'
            : '0 8px 32px rgba(0,0,0,0.4)',
          transition: "all 0.3s ease",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease-in-out",
            backgroundColor: mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
            "&:hover": {
              backgroundColor: mode === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
            },
            "&.Mui-focused": {
              backgroundColor: mode === "light" ? "#fff" : "rgba(255,255,255,0.08)",
              boxShadow: mode === "light"
                ? "0 0 0 4px rgba(37, 99, 235, 0.1)"
                : "0 0 0 4px rgba(96, 165, 250, 0.2)",
            },
          },
          "& .MuiInputBase-input": {
            padding: "12px 14px",
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          fontWeight: 500,
          color: mode === 'light' ? '#64748b' : '#60a5fa', // Restore Primary Blue for Dark Mode
          "&.Mui-focused": {
            color: mode === 'light' ? '#2563eb' : '#60a5fa',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
          },
          "&:hover fieldset": {
            borderColor: mode === 'light' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(96, 165, 250, 0.5)',
          },
          "&.Mui-focused fieldset": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          color: mode === 'light' ? '#0f172a' : '#f8fafc',
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
        },
      },
    },
  },
});

export default function ThemeContextProvider({ children }) {
  // 💾 1. Get initial mode from localStorage or System Preference
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) return savedMode;
    return prefersDarkMode ? "dark" : "light";
  });

  // 💾 2. Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    // Apply theme attribute to body for standard CSS targeting
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
