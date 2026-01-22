import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast } from '../Context';
import { socialAuthService, authService } from '../services';
import storage from '../utils/storage';
import { SocialAuthResult } from '../types';
import { AxiosError } from "axios";

export const useSocialAuth = () => {
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const { setUserToken } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const navigate = useNavigate();

    interface GoogleUser {
        uid: string;
        email: string | null;
        displayName: string | null;
    }

    const syncWithBackend = async (googleUser: GoogleUser) => {
        try {
            if (!googleUser.email) return null;

            // Generate a secure password based on UID to ensure consistency
            // Policy: Upper + Lower + Number + Special + 8 chars
            const securePass = `A@${googleUser.uid.substring(0, 10)}z1`;

            // Generate deterministic phone number from UID for consistent registration
            const uidHash = googleUser.uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const deterministicSuffix = (uidHash % 90000000 + 10000000).toString(); // Ensures 8 digits
            const phone = `010${deterministicSuffix}`;

            // 1. Try Login first
            try {
                const loginRes = await authService.login({
                    email: googleUser.email,
                    password: securePass
                });

                if (loginRes.message === "success" && loginRes.token) {
                    return loginRes.token;
                }
            } catch {
                // If login fails, user might not exist or password differs
                // proceed to registration
            }

            // 2. Try Registering
            try {
                const registerRes = await authService.register({
                    name: googleUser.displayName || "Google User",
                    email: googleUser.email,
                    password: securePass,
                    rePassword: securePass,
                    phone: phone,
                    gender: "male"
                });

                if (registerRes.message === "success") {
                    // 3. Login after successful registration
                    const newLogin = await authService.login({
                        email: googleUser.email,
                        password: securePass
                    });
                    if (newLogin.message === "success" && newLogin.token) {
                        return newLogin.token;
                    }
                }
            } catch (error: unknown) {
                const regErr = error as AxiosError<{ message?: string }>;
                const errorMessage = regErr.response?.data?.message || "";

                // If registration fails because "Account Already Exists" or similar
                // It means the user registered manually with a different password
                if (errorMessage.toLowerCase().includes("exist") || errorMessage.toLowerCase().includes("email")) {
                    throw new Error(t("auth.emailExistsUsePassword") || "🔐 This email is already linked to an existing account. Please use your email and password to sign in, or use 'Forgot Password' to reset it.");
                } else {
                    // Log other registration errors (e.g. phone validation)
                    console.error("Registration failed:", errorMessage);
                    throw new Error(errorMessage || t("auth.syncFailed") || "Registration failed.");
                }
            }
            return null;
        } catch (error) {
            console.error("Backend Sync Error:", error);
            throw error;
        }
    };

    const handleSocialLogin = async (platform: 'google') => {
        setSocialLoading(platform);
        try {
            let result: SocialAuthResult | undefined;
            if (platform === 'google') {
                result = await socialAuthService.signInWithGoogle();
            }

            if (result && result.success && result.token && result.user) {
                // Determine valid backend token
                let finalToken = result.token;

                // syncing with backend to get real token
                try {
                    const backendToken = await syncWithBackend(result.user);
                    if (backendToken) {
                        finalToken = backendToken;
                        // Remove socialUser flag just in case
                        storage.remove("socialUser");
                    } else {
                        // If sync returns null (unexpected), we must stop.
                        // We cannot allow "Guest Mode" because it breaks cart/orders.
                        throw new Error(t("auth.syncFailed") || "Authentication synchronization failed.");
                    }
                } catch (error: unknown) {
                    const syncErr = error as Error;
                    showToast(`⚠️ ${syncErr.message || t("auth.syncFailed")}`, "error");
                    return; // Stop login if account conflict
                }

                showToast(`✅ ${t("auth.loginSuccess")}`, "success");

                // Securely store consistent user data
                storage.set("userToken", finalToken);

                if (result.user?.email) storage.set("userEmail", result.user.email);
                if (result.user?.displayName) storage.set("userName", result.user.displayName);

                // Update Application State
                setUserToken(finalToken);

                // Smooth Redirect
                navigate("/");
            } else if (result && result.error) {
                // Display specific error from service if available
                showToast(`❌ ${result.error}`, "error");
            }
        } catch (error) {
            console.error("[SocialAuth] Unexpected Error:", error);
            showToast(`❌ ${t("auth.loginError")}`, "error");
        } finally {
            setSocialLoading(null);
        }
    };

    return {
        handleSocialLogin,
        socialLoading
    };
};
