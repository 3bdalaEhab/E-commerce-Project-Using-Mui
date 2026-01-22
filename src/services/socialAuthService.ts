import {
    signInWithPopup,
    signOut as firebaseSignOut,
    UserCredential,
    AuthError,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export interface SocialAuthResult {
    success: boolean;
    user?: {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
        providerId: string;
    };
    token?: string;
    error?: string;
}

type SocialProvider = 'google';

const getProvider = (provider: SocialProvider) => {
    switch (provider) {
        case 'google':
            return googleProvider;
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
};

const handleAuthError = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/popup-closed-by-user':
            return 'Login cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Popup was blocked. Please allow popups for this site.';
        case 'auth/cancelled-popup-request':
            return 'Another popup is already open.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with this email using a different sign-in method.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled. Please contact support.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        default:
            return error.message || 'Authentication failed. Please try again.';
    }
};

export const socialAuthService = {
    /**
     * Sign in with a social provider (Google)
     */
    signIn: async (provider: SocialProvider): Promise<SocialAuthResult> => {
        // Check if Firebase keys are placeholders
        if (!auth.app.options.apiKey || auth.app.options.apiKey === "YOUR_API_KEY") {
            return {
                success: false,
                error: "Firebase keys are missing. Please add VITE_FIREBASE_* keys to your .env file."
            };
        }
        try {
            const authProvider = getProvider(provider);
            const result: UserCredential = await signInWithPopup(auth, authProvider);

            // Get the ID token
            const token = await result.user.getIdToken();

            return {
                success: true,
                user: {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    providerId: provider,
                },
                token,
            };
        } catch (error) {
            const authError = error as AuthError;
            return {
                success: false,
                error: handleAuthError(authError),
            };
        }
    },

    /**
     * Sign in with Google
     */
    signInWithGoogle: async (): Promise<SocialAuthResult> => {
        return socialAuthService.signIn('google');
    },

    /**
     * Sign out from Firebase
     */
    signOut: async (): Promise<boolean> => {
        try {
            await firebaseSignOut(auth);
            return true;
        } catch (error) {
            console.error('Sign out error:', error);
            return false;
        }
    },

    /**
     * Get current Firebase user
     */
    getCurrentUser: () => {
        return auth.currentUser;
    },

    /**
     * Listen for auth state changes
     */
    onAuthStateChanged: (callback: (user: import('firebase/auth').User | null) => void) => {
        return auth.onAuthStateChanged(callback);
    },
};

export default socialAuthService;
