import api from './api';
import { CartResponse } from '../types';

interface AddToCartResponse {
    status: string;
    message: string;
    numOfCartItems: number;
    data: {
        _id: string;
        cartOwner: string;
        products: Array<{
            count: number;
            _id: string;
            product: string;
            price: number;
        }>;
        totalCartPrice: number;
    };
}

type UpdateCartResponse = AddToCartResponse;

export const cartService = {
    // Get user cart
    getCart: async (): Promise<CartResponse> => {
        const { data } = await api.get<CartResponse>('/cart');
        return data;
    },

    // Add product to cart
    addToCart: async (productId: string): Promise<AddToCartResponse> => {
        const { data } = await api.post<AddToCartResponse>('/cart', { productId });
        return data;
    },

    // Update cart item quantity
    updateCartItem: async (productId: string, count: number): Promise<UpdateCartResponse> => {
        const { data } = await api.put<UpdateCartResponse>(`/cart/${productId}`, { count });
        return data;
    },

    // Remove item from cart
    removeFromCart: async (productId: string): Promise<CartResponse> => {
        const { data } = await api.delete<CartResponse>(`/cart/${productId}`);
        return data;
    },

    // Clear entire cart
    clearCart: async (): Promise<{ message: string }> => {
        const { data } = await api.delete<{ message: string }>('/cart');
        return data;
    },

    // Apply coupon
    applyCoupon: async (couponName: string): Promise<CartResponse> => {
        const { data } = await api.put<CartResponse>('/cart/applyCoupon', { couponName });
        return data;
    },
};

export default cartService;
