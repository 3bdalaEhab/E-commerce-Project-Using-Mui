import api from './api';
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    ForgotPasswordCredentials
} from '../types';

interface ChangePasswordData {
    currentPassword: string;
    password: string;
    rePassword: string;
}

interface VerifyResetCodeData {
    resetCode: string;
}

interface ResetPasswordData {
    email: string;
    newPassword: string;
}

export const authService = {
    // Login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/signin', credentials);
        return data;
    },

    // Register
    register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/signup', userData);
        return data;
    },

    // Change Password (logged in user)
    changePassword: async (passwordData: ChangePasswordData): Promise<AuthResponse> => {
        const { data } = await api.put<AuthResponse>('/users/changeMyPassword', passwordData);
        return data;
    },

    // Forgot Password - Request reset code
    forgotPassword: async (emailData: ForgotPasswordCredentials): Promise<{ statusMsg: string; message: string }> => {
        const { data } = await api.post('/auth/forgotPasswords', emailData);
        return data;
    },

    // Verify Reset Code
    verifyResetCode: async (codeData: VerifyResetCodeData): Promise<{ status: string }> => {
        const { data } = await api.post('/auth/verifyResetCode', codeData);
        return data;
    },

    // Reset Password
    resetPassword: async (resetData: ResetPasswordData): Promise<AuthResponse> => {
        const { data } = await api.put('/auth/resetPassword', resetData);
        return data;
    },
};

export default authService;
