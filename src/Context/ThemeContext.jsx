import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#1976d2" },
          secondary: { main: "#ff9800" },
          background: {
            default: "#f4f6f8",
            paper: "#ffffff",
          },
          text: {
            primary: "#0d0d0d",
            secondary: "#555",
          },
        }
      : {
          primary: { main: "#90caf9" },
          secondary: { main: "#f48fb1" },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
          },
        }),
  },
  typography: {
    fontFamily: "'Cairo', 'Roboto', sans-serif",
  },
});

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light"); 

  
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
