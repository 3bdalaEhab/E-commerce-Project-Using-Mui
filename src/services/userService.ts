import api from './api';
import { ApiResponse, User } from '../types';
import { decodeToken } from '../utils/security';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';

interface UserData {
    name?: string;
    email?: string;
    phone?: string;
}

export const userService = {
    // Update logged in user data
    updateMe: async (userData: UserData): Promise<ApiResponse<User>> => {
        const { data } = await api.put<ApiResponse<User>>('/users/updateMe/', userData);
        return data;
    },

    // Get current user data from token or storage
    getMe: (): User | null => {
        try {
            const decoded = decodeToken();

            if (!decoded) return null;

            // The JWT token contains: id, name, role (but NOT email)
            // Email must come from localStorage (stored during login)

            // Get name from token (most reliable source)
            const name = decoded.name || storage.get<string>('userName') || 'User';

            // Get email from storage (login saves it there since token doesn't have it)
            const email = storage.get<string>('userEmail') || '';

            return {
                name,
                email,
                role: decoded.role || 'user'
            };
        } catch (error) {
            logger.error('Error getting user data', 'userService', error);
            return null;
        }
    }
};

export default userService;

