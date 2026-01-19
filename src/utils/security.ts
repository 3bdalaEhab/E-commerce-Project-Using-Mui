/**
 * Security Utilities
 * Handles token validation, XSS protection, and other security measures
 */

import { storage } from './storage';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

/**
 * Validate JWT token structure and expiration
 */
export const validateToken = (token: string | null): boolean => {
    if (!token || typeof token !== 'string') {
        return false;
    }

    try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check if token has required fields
        if (!decoded.exp || !decoded.iat) {
            return false;
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
};

/**
 * Get current token from storage (validated)
 */
export const getValidToken = (): string | null => {
    const token = storage.get<string>('userToken');

    if (!token || !validateToken(token)) {
        // Token is invalid or expired, remove it
        storage.remove('userToken');
        return null;
    }

    return token;
};

/**
 * Decode token safely
 */
export const decodeToken = (): DecodedToken | null => {
    const token = getValidToken();

    if (!token) {
        return null;
    }

    try {
        return jwtDecode<DecodedToken>(token);
    } catch {
        return null;
    }
};

/**
 * Get user ID from token
 */
export const getUserId = (): string | null => {
    const decoded = decodeToken();
    return decoded?._id || decoded?.id || null;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') {
        return '';
    }

    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

/**
 * Escape HTML to prevent XSS
 */
export const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Egyptian phone number
 */
export const isValidEgyptianPhone = (phone: string): boolean => {
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
};

/**
 * Check if password meets security requirements
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[#?!@$%^&*-]/.test(password)) {
        errors.push('Password must contain at least one special character (#?!@$%^&*-)');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Generate secure random string
 */
export const generateSecureToken = (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
