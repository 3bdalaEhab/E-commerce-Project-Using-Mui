import api from './api';
import { ApiResponse, Address } from '../types';

export const addressService = {
    // Get all user addresses
    getAddresses: async (): Promise<ApiResponse<Address[]>> => {
        const { data } = await api.get<ApiResponse<Address[]>>('/addresses');
        return data;
    },

    // Add new address
    addAddress: async (address: Omit<Address, '_id'>): Promise<ApiResponse<Address[]>> => {
        const { data } = await api.post<ApiResponse<Address[]>>('/addresses', address);
        return data;
    },

    // Remove address
    removeAddress: async (addressId: string): Promise<ApiResponse<Address[]>> => {
        const { data } = await api.delete<ApiResponse<Address[]>>(`/addresses/${addressId}`);
        return data;
    }
};

export default addressService;
