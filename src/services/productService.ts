import api from './api';
import { Product, ApiResponse } from '../types';

interface ProductsResponse {
    results: number;
    metadata: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
    };
    data: Product[];
}

interface ProductParams {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
    category?: string;
    brand?: string;
    'price[gte]'?: number;
    'price[lte]'?: number;
}

export const productService = {
    // Get all products with filters
    getProducts: async (params?: ProductParams): Promise<ProductsResponse> => {
        const { data } = await api.get<ProductsResponse>('/products', { params });
        return data;
    },

    // Get single product by ID
    getProductById: async (productId: string): Promise<{ data: Product }> => {
        const { data } = await api.get<{ data: Product }>(`/products/${productId}`);
        return data;
    },

    // Search products
    searchProducts: async (keyword: string): Promise<ProductsResponse> => {
        const { data } = await api.get<ProductsResponse>('/products', {
            params: { keyword },
        });
        return data;
    },
};

export default productService;
