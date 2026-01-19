import api from './api';
import { Order } from '../types';

// Note: This interface is kept for documentation purposes
interface _OrdersResponse {
    results: number;
    data: Order[];
}

interface CheckoutData {
    shippingAddress: {
        details: string;
        phone: string;
        city: string;
    };
}

interface CheckoutResponse {
    status: string;
    session: {
        url: string;
    };
}

export const orderService = {
    // Get all user orders
    getUserOrders: async (userId: string): Promise<Order[]> => {
        const { data } = await api.get<Order[] | { data: Order[] } | { results: number; data: Order[] }>(`/orders/user/${userId}`);

        // Handle different response shapes from Route API
        if (Array.isArray(data)) return data;
        if ('data' in data && Array.isArray(data.data)) return data.data;
        return [];
    },

    // Get specific order
    getOrderById: async (orderId: string): Promise<{ data: Order }> => {
        const { data } = await api.get<{ data: Order }>(`/orders/${orderId}`);
        return data;
    },

    // Create cash order
    createCashOrder: async (cartId: string, shippingData: CheckoutData): Promise<{ data: Order }> => {
        const { data } = await api.post<{ data: Order }>(`/orders/${cartId}`, shippingData);
        return data;
    },

    // Create checkout session (online payment)
    createCheckoutSession: async (cartId: string, shippingData: CheckoutData): Promise<CheckoutResponse> => {
        const { data } = await api.post<CheckoutResponse>(
            `/orders/checkout-session/${cartId}?url=${window.location.origin}`,
            shippingData
        );
        return data;
    },
};

export default orderService;
