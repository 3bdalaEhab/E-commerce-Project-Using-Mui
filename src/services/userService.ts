import api from './api';
import { ApiResponse, User } from '../types';
import { decodeToken } from '../utils/security';
import { logger } from '../utils/logger';

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

    // Get current user data from token
    getMe: (): User | null => {
        try {
            const decoded = decodeToken();
            if (!decoded) return null;

            return {
                name: decoded.name || 'User',
                email: decoded.email || '',
                role: decoded.role || 'user'
            };
        } catch (error) {
            logger.error('Error decoding token', 'userService', error);
            return null;
        }
    }
};

export default userService;
