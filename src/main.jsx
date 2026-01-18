import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import TokenContextProvider from "./Context/tokenContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CartContextProvider from "./Context/CartContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext.jsx";
import ThemeContextProvider from "./Context/ThemeContext.jsx";
import { ToastProvider } from "./Context/ToastContext.jsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <ToastProvider>
          <WishlistProvider>
            <TokenContextProvider>
              <CartContextProvider>
                <App />
              </CartContextProvider>
            </TokenContextProvider>
          </WishlistProvider>
        </ToastProvider>
      </ThemeContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
