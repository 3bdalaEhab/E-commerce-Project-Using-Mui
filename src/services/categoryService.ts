import api from './api';
import { Category, Brand, SubCategory } from '../types';

interface CategoriesResponse {
    results: number;
    data: Category[];
}

interface BrandsResponse {
    results: number;
    data: Brand[];
}

interface SubCategoriesResponse {
    results: number;
    data: SubCategory[];
}

export const categoryService = {
    // Get all categories
    getCategories: async (): Promise<CategoriesResponse> => {
        const { data } = await api.get<CategoriesResponse>('/categories');
        return data;
    },

    // Get single category
    getCategoryById: async (categoryId: string): Promise<{ data: Category }> => {
        const { data } = await api.get<{ data: Category }>(`/categories/${categoryId}`);
        return data;
    },

    // Get subcategories of a category
    getSubCategories: async (categoryId: string): Promise<SubCategoriesResponse> => {
        const { data } = await api.get<SubCategoriesResponse>(`/categories/${categoryId}/subcategories`);
        return data;
    },
};

export const brandService = {
    // Get all brands
    getBrands: async (): Promise<BrandsResponse> => {
        const { data } = await api.get<BrandsResponse>('/brands');
        return data;
    },

    // Get single brand
    getBrandById: async (brandId: string): Promise<{ data: Brand }> => {
        const { data } = await api.get<{ data: Brand }>(`/brands/${brandId}`);
        return data;
    },
};

export { categoryService as default };
