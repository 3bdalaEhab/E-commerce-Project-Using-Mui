import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        checker({
            eslint: {
                useFlatConfig: true,
                lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
            },
        }),
    ],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@context": path.resolve(__dirname, "./src/Context"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@types": path.resolve(__dirname, "./src/types"),
            "@constants": path.resolve(__dirname, "./src/constants"),
            "@assets": path.resolve(__dirname, "./src/assets"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    mui: ["@mui/material", "@mui/icons-material"],
                    query: ["@tanstack/react-query"],
                    motion: ["framer-motion"],
                },
            },
        },
        sourcemap: false,
        minify: "terser",
    },
});
