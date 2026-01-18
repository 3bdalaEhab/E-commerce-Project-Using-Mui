import api from './api';
import { Product, WishlistResponse } from '../types';

interface WishlistActionResponse {
    status: string;
    message: string;
    data: string[]; // Array of product IDs
}

export const wishlistService = {
    // Get user wishlist
    getWishlist: async (): Promise<WishlistResponse> => {
        const { data } = await api.get<WishlistResponse>('/wishlist');
        return data;
    },

    // Add product to wishlist
    addToWishlist: async (productId: string): Promise<WishlistActionResponse> => {
        const { data } = await api.post<WishlistActionResponse>('/wishlist', { productId });
        return data;
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId: string): Promise<WishlistActionResponse> => {
        const { data } = await api.delete<WishlistActionResponse>(`/wishlist/${productId}`);
        return data;
    },
};

export default wishlistService;
