// Firebase Configuration
// Replace these values with your Firebase project configuration
// You can find these in Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration object
// IMPORTANT: Replace these placeholder values with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase initialization complete

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account', // Force account selection
});

export { analytics };
export default app;
