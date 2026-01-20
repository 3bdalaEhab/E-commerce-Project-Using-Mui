import React, { createContext, useEffect, useState, useCallback, useMemo, ReactNode, useContext } from 'react';
import { cartService } from '../services';
import { Cart } from '../types';
import { tokenContext } from './tokenContext';

// Types
interface CartActionResponse {
    status?: string;
    message?: string;
    numOfCartItems?: number;
    error?: string;
    data?: Cart | null;
}

interface CartContextType {
    numOfCartItems: number;
    cartData: Cart | null;
    loading: boolean;
    addToCart: (productId: string) => Promise<CartActionResponse | null>;
    updateItem: (productId: string, count: number) => Promise<CartActionResponse | null>;
    removeSpecificItem: (productId: string) => Promise<CartActionResponse | null>;
    removeAllItems: () => Promise<CartActionResponse | null>;
    getCart: () => Promise<CartActionResponse | null>;
}

interface CartProviderProps {
    children: ReactNode;
}

// Create Context with proper typing
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType>({
    numOfCartItems: 0,
    cartData: null,
    loading: false,
    addToCart: async () => null,
    updateItem: async () => null,
    removeSpecificItem: async () => null,
    removeAllItems: async () => null,
    getCart: async () => null,
});

export default function CartContextProvider({ children }: CartProviderProps) {
    const [numOfCartItems, setNumOfCartItems] = useState<number>(0);
    const [cartData, setCartData] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { userToken } = useContext(tokenContext);

    const getCart = useCallback(async () => {
        if (!userToken) return null;
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setNumOfCartItems(data.numOfCartItems ?? 0);
            setCartData(data.data ?? null);
            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    const addToCart = useCallback(async (productId: string) => {
        try {
            const data = await cartService.addToCart(productId);
            setNumOfCartItems(data.numOfCartItems ?? 0);
            // After adding, we might want to refresh the full cart data if needed, 
            // but the response usually contains the basic info.
            // For a better UX, we can trigger a full fetch or update the data.
            await getCart();
            return data;
        } catch (error) {
            throw error;
        }
    }, [getCart]);

    const updateItem = useCallback(async (productId: string, count: number) => {
        try {
            const data = await cartService.updateCartItem(productId, count);
            setNumOfCartItems(data.numOfCartItems ?? 0);
            // Refresh full cart data to ensure product objects are populated (not just IDs)
            await getCart();
            return data;
        } catch (error) {
            throw error;
        }
    }, [getCart]);

    const removeSpecificItem = useCallback(async (productId: string) => {
        try {
            const data = await cartService.removeFromCart(productId);
            setNumOfCartItems(data.numOfCartItems ?? 0);
            // Refresh full cart data to ensure product objects are populated
            await getCart();
            return data;
        } catch (error) {
            throw error;
        }
    }, [getCart]);

    const removeAllItems = useCallback(async () => {
        try {
            const res = await cartService.clearCart();
            setNumOfCartItems(0);
            setCartData(null);
            return res;
        } catch (error) {
            throw error;
        }
    }, []);

    useEffect(() => {
        if (userToken) getCart();
    }, [userToken, getCart]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<CartContextType>(
        () => ({
            numOfCartItems,
            cartData,
            loading,
            addToCart,
            updateItem,
            removeSpecificItem,
            removeAllItems,
            getCart,
        }),
        [numOfCartItems, cartData, loading, addToCart, updateItem, removeSpecificItem, removeAllItems, getCart]
    );

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook for type-safe context usage
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};
