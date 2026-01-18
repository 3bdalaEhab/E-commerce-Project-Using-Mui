import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../types';

interface QuickViewContextType {
    activeProduct: Product | null;
    isOpen: boolean;
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType>({
    activeProduct: null,
    isOpen: false,
    openQuickView: () => { },
    closeQuickView: () => { },
});

export const useQuickView = () => useContext(QuickViewContext);

export const QuickViewProvider = ({ children }: { children: ReactNode }) => {
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openQuickView = (product: Product) => {
        setActiveProduct(product);
        setIsOpen(true);
    };

    const closeQuickView = () => {
        setIsOpen(false);
        // Small delay to clear product to avoid content jump during closing animation
        setTimeout(() => setActiveProduct(null), 300);
    };

    return (
        <QuickViewContext.Provider value={{ activeProduct, isOpen, openQuickView, closeQuickView }}>
            {children}
        </QuickViewContext.Provider>
    );
};
