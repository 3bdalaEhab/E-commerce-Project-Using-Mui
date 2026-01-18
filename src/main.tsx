import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import {
    TokenContextProvider,
    CartContextProvider,
    WishlistProvider,
    ThemeContextProvider,
    ToastProvider,
} from './Context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Optimized Query Client Configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
        },
    },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeContextProvider>
                    <ToastProvider>
                        <TokenContextProvider>
                            <CartContextProvider>
                                <WishlistProvider>
                                    <App />
                                </WishlistProvider>
                            </CartContextProvider>
                        </TokenContextProvider>
                    </ToastProvider>
                </ThemeContextProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>
);
