import api from './api';
import { ApiResponse, User } from '../types';
import { jwtDecode } from 'jwt-decode';

interface UserData {
    name: string;
    email: string;
    phone: string;
}

interface DecodedToken {
    id: string;
    name: string;
    email?: string;
    role: string;
    iat: number;
    exp: number;
}

export const userService = {
    // Update logged in user data
    updateMe: async (userData: UserData): Promise<ApiResponse<User>> => {
        const { data } = await api.put<ApiResponse<User>>('/users/updateMe/', userData);
        return data;
    },

    // Get current user data from token
    getMe: (): User | null => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return null;

            const decoded = jwtDecode<DecodedToken>(token);
            return {
                name: decoded.name || 'User',
                email: decoded.email || '',
                role: decoded.role || 'user'
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
};

export default userService;
