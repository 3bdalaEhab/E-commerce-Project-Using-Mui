import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { wishlistService } from '../services';
import { Product } from '../types';

// Types
interface WishlistContextType {
    wishListItemId: string[];
    numWishItemList: number;
    wishlist: Product[];
    loading: boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    getWishlist: () => Promise<void>;
}

interface WishlistProviderProps {
    children: ReactNode;
}

// Create Context with proper typing
export const WishlistContext = createContext<WishlistContextType>({
    wishListItemId: [],
    numWishItemList: 0,
    wishlist: [],
    loading: false,
    addToWishlist: async () => { },
    removeFromWishlist: async () => { },
    getWishlist: async () => { },
});

export function WishlistProvider({ children }: WishlistProviderProps) {
    const [numWishItemList, setNumWishItemList] = useState<number>(0);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [wishListItemId, setWishListItemId] = useState<string[]>([]);

    const token = localStorage.getItem('userToken');

    // Extract product IDs from wishlist data
    const extractWishlistIds = useCallback((data: Product[]) => {
        const ids = data.map((item) => item._id);
        setWishListItemId(ids);
    }, []);

    // Fetch all wishlist items
    const getWishlist = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await wishlistService.getWishlist();
            setNumWishItemList(data.count || data.data?.length || 0);
            setWishlist(data.data || []);
            extractWishlistIds(data.data || []);
        } catch (error) {
            console.error('❌ Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [token, extractWishlistIds]);

    // Add product to wishlist
    const addToWishlist = useCallback(async (productId: string) => {
        if (!token) return;
        try {
            await wishlistService.addToWishlist(productId);
            setNumWishItemList((prev) => prev + 1);
            setWishListItemId((prev) => [...prev, productId]);
        } catch (error) {
            console.error('❌ Error adding to wishlist:', error);
            throw error;
        }
    }, [token]);

    // Remove product from wishlist
    const removeFromWishlist = useCallback(async (productId: string) => {
        if (!token) return;
        try {
            await wishlistService.removeFromWishlist(productId);
            setWishlist((prev) => prev.filter((item) => item._id !== productId));
            setNumWishItemList((prev) => Math.max(prev - 1, 0));
            setWishListItemId((prev) => prev.filter((id) => id !== productId));
        } catch (error) {
            console.error('❌ Error removing from wishlist:', error);
            throw error;
        }
    }, [token]);

    // Fetch wishlist on mount or when token changes
    useEffect(() => {
        if (token) getWishlist();
    }, [token, getWishlist]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<WishlistContextType>(
        () => ({
            wishListItemId,
            numWishItemList,
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            getWishlist,
        }),
        [wishListItemId, numWishItemList, wishlist, loading, addToWishlist, removeFromWishlist, getWishlist]
    );

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
}

// Custom Hook for easy access to WishlistContext
export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
