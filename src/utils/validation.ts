/**
 * Validation Utilities
 * Centralized validation functions for forms and inputs
 */

import { isValidEmail, isValidEgyptianPhone, validatePassword } from './security';

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Validate name input
 */
export const validateName = (name: string): ValidationResult => {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Name is required' };
    }

    if (name.trim().length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters' };
    }

    if (name.trim().length > 50) {
        return { valid: false, message: 'Name must be less than 50 characters' };
    }

    // Check for valid name format (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name.trim())) {
        return { valid: false, message: 'Name contains invalid characters' };
    }

    return { valid: true };
};

/**
 * Validate email input
 */
export const validateEmail = (email: string): ValidationResult => {
    if (!email || email.trim().length === 0) {
        return { valid: false, message: 'Email is required' };
    }

    if (!isValidEmail(email.trim())) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true };
};

/**
 * Validate phone input (Egyptian format)
 */
export const validatePhone = (phone: string): ValidationResult => {
    if (!phone || phone.trim().length === 0) {
        return { valid: false, message: 'Phone number is required' };
    }

    // Remove spaces and dashes
    const cleanedPhone = phone.replace(/[\s-]/g, '');

    if (!isValidEgyptianPhone(cleanedPhone)) {
        return { valid: false, message: 'Please enter a valid Egyptian phone number (01xxxxxxxxx)' };
    }

    return { valid: true };
};

/**
 * Validate password input
 */
export const validatePasswordInput = (password: string): ValidationResult => {
    if (!password || password.length === 0) {
        return { valid: false, message: 'Password is required' };
    }

    const result = validatePassword(password);
    
    if (!result.valid) {
        return {
            valid: false,
            message: result.errors[0] || 'Password does not meet requirements',
        };
    }

    return { valid: true };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword || confirmPassword.length === 0) {
        return { valid: false, message: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }

    return { valid: true };
};

/**
 * Validate reset code (6 digits)
 */
export const validateResetCode = (code: string): ValidationResult => {
    if (!code || code.trim().length === 0) {
        return { valid: false, message: 'Reset code is required' };
    }

    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code.trim())) {
        return { valid: false, message: 'Reset code must be 6 digits' };
    }

    return { valid: true };
};

/**
 * Validate address fields
 */
export const validateAddress = (address: {
    details?: string;
    city?: string;
    phone?: string;
}): ValidationResult => {
    if (!address.details || address.details.trim().length === 0) {
        return { valid: false, message: 'Address details are required' };
    }

    if (address.details.trim().length < 10) {
        return { valid: false, message: 'Address must be at least 10 characters' };
    }

    if (!address.city || address.city.trim().length === 0) {
        return { valid: false, message: 'City is required' };
    }

    if (address.phone) {
        const phoneValidation = validatePhone(address.phone);
        if (!phoneValidation.valid) {
            return phoneValidation;
        }
    }

    return { valid: true };
};

/**
 * Validate product quantity
 */
export const validateQuantity = (quantity: number, available: number): ValidationResult => {
    if (quantity <= 0) {
        return { valid: false, message: 'Quantity must be greater than 0' };
    }

    if (quantity > available) {
        return { valid: false, message: `Only ${available} items available` };
    }

    if (quantity > 100) {
        return { valid: false, message: 'Maximum quantity is 100' };
    }

    return { valid: true };
};

/**
 * Sanitize and validate search query
 */
export const validateSearchQuery = (query: string): ValidationResult => {
    if (!query || query.trim().length === 0) {
        return { valid: false, message: 'Search query cannot be empty' };
    }

    if (query.trim().length < 2) {
        return { valid: false, message: 'Search query must be at least 2 characters' };
    }

    if (query.trim().length > 100) {
        return { valid: false, message: 'Search query is too long' };
    }

    // Check for potentially malicious patterns
    const dangerousPatterns = /[<>{}[\]]/;
    if (dangerousPatterns.test(query)) {
        return { valid: false, message: 'Search query contains invalid characters' };
    }

    return { valid: true };
};
