import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';
import { getValidToken } from '../utils/security';

// API Base URL
export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// Create Axios instance with defaults
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Add token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Use secure token validation
        const token = getValidToken();
        if (token && config.headers) {
            config.headers.token = token;
        }
        return config;
    },
    (error: AxiosError) => {
        logger.error('Request interceptor error', 'API', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle common errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'An error occurred';

        // Handle 401 Unauthorized
        if (status === 401) {
            logger.warn('Unauthorized access - token expired or invalid', 'API');
            storage.remove('userToken');
            
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                // Use setTimeout to avoid navigation issues during render
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            }
        }
        
        // Handle 403 Forbidden
        else if (status === 403) {
            logger.error('Access forbidden', 'API', { status, message });
        }
        
        // Handle 500 Server Error
        else if (status === 500) {
            logger.error('Server error', 'API', { status, message });
        }
        
        // Handle Network Error
        else if (!error.response) {
            logger.error('Network error', 'API', { message: error.message });
        }

        // Log all errors for debugging
        logger.error('API request failed', 'API', {
            status,
            message,
            url: error.config?.url,
            method: error.config?.method,
        });
        
        return Promise.reject(error);
    }
);

export default api;
