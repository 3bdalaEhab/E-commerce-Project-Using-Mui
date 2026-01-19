/**
 * Secure Storage Utility
 * Provides a safe and consistent way to handle localStorage
 * with error handling and type safety
 */

type StorageKey = 'userToken' | 'recent_searches' | 'recently_viewed' | 'themeMode' | 'primaryColor';

class StorageService {
    private isAvailable(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Safely get item from localStorage
     */
    get<T>(key: StorageKey, defaultValue: T | null = null): T | null {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return defaultValue;
        }

        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;

            // Try to parse as JSON, fallback to string
            try {
                return JSON.parse(item) as T;
            } catch {
                return item as unknown as T;
            }
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

    /**
     * Safely set item in localStorage
     */
    set<T>(key: StorageKey, value: T): boolean {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        try {
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);

            // If quota exceeded, try to clear old data
            if (error instanceof DOMException && error.code === 22) {
                this.clearOldData();
                try {
                    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(key, serialized);
                    return true;
                } catch (retryError) {
                    console.error('Failed to save after clearing old data:', retryError);
                    return false;
                }
            }
            return false;
        }
    }

    /**
     * Remove item from localStorage
     */
    remove(key: StorageKey): boolean {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
            return false;
        }
    }

    /**
     * Clear all app-related data from localStorage
     */
    clear(): boolean {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const keys: StorageKey[] = ['userToken', 'recent_searches', 'recently_viewed', 'themeMode', 'primaryColor'];
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    /**
     * Clear old/unused data to free up space
     */
    private clearOldData(): void {
        try {
            // Clear old recently viewed items (keep only last 5)
            const recent = this.get<Product[]>('recently_viewed', []);
            if (recent && recent.length > 5) {
                this.set('recently_viewed', recent.slice(0, 5));
            }

            // Clear old search history (keep only last 5)
            const searches = this.get<string[]>('recent_searches', []);
            if (searches && searches.length > 5) {
                this.set('recent_searches', searches.slice(0, 5));
            }
        } catch (error) {
            console.error('Error clearing old data:', error);
        }
    }

    /**
     * Check if key exists in localStorage
     */
    has(key: StorageKey): boolean {
        if (!this.isAvailable()) {
            return false;
        }
        return localStorage.getItem(key) !== null;
    }
}

// Import Product type for type safety
interface Product {
    _id: string;
    [key: string]: unknown;
}

export const storage = new StorageService();
export default storage;
