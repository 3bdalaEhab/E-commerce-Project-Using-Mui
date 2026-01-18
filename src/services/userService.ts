import api from './api';
import { ApiResponse, User } from '../types';

interface UserData {
    name: string;
    email: string;
    phone: string;
}

export const userService = {
    // Update logged in user data
    updateMe: async (userData: UserData): Promise<ApiResponse<User>> => {
        const { data } = await api.put<ApiResponse<User>>('/users/updateMe/', userData);
        return data;
    },

    // Get current user data
    getMe: async (): Promise<ApiResponse<User>> => {
        // This endpoint might vary, but usually it's /users/getMe or verified via token
        // For RouteMisr, often we rely on token decode or localized storage, 
        // but let's assume standard REST pattern for now or just use update logic.
        // If /users/me exists:
        // const { data } = await api.get<ApiResponse>('/users/me');
        // return data;
        return { message: 'User data' }; // Placeholder if not strictly needed yet
    }
};

export default userService;
