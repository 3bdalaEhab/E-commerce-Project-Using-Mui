import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

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
        const token = localStorage.getItem('userToken');
        if (token && config.headers) {
            config.headers.token = token;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle common errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('userToken');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden:', error);
        }
        
        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', error);
        }
        
        // Handle Network Error
        if (!error.response) {
            console.error('Network error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default api;
