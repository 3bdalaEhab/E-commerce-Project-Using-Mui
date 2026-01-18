import { useState, useEffect } from 'react';
import { Product } from '../types';

export const useRecentlyViewed = (currentProduct: Product | null) => {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Load from local storage
        const stored = localStorage.getItem('recently_viewed');
        if (stored) {
            try {
                setRecentProducts(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recently viewed", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!currentProduct) return;

        setRecentProducts(prev => {
            // Remove current product if it exists (to move it to top)
            const filtered = prev.filter(p => p._id !== currentProduct._id);
            // Add current to front, limit to 10
            const updated = [currentProduct, ...filtered].slice(0, 10);

            localStorage.setItem('recently_viewed', JSON.stringify(updated));
            return updated;
        });
    }, [currentProduct?._id]); // Only run when Product ID changes

    return recentProducts;
};
