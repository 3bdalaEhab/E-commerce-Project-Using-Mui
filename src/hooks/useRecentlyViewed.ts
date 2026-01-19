import { useState, useEffect } from 'react';
import { Product } from '../types';
import { storage } from '../utils/storage';
import { logger } from '../utils/logger';

export const useRecentlyViewed = (currentProduct: Product | null) => {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Load from storage using utility
        const stored = storage.get<Product[]>('recently_viewed', []);
        if (Array.isArray(stored) && stored.length > 0) {
            setRecentProducts(stored);
        }
    }, []);

    useEffect(() => {
        if (!currentProduct) return;

        setRecentProducts(prev => {
            // Remove current product if it exists (to move it to top)
            const filtered = prev.filter(p => p._id !== currentProduct._id);
            // Add current to front, limit to 10
            const updated = [currentProduct, ...filtered].slice(0, 10);

            // Save using storage utility
            storage.set('recently_viewed', updated);
            return updated;
        });
    }, [currentProduct?._id]); // Only run when Product ID changes

    return recentProducts;
};
