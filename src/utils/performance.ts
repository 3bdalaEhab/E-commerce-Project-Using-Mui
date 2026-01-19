/**
 * Performance utilities for the application
 */

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
): IntersectionObserver => {
    const defaultOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
    };

    return new IntersectionObserver(callback, defaultOptions);
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};

// Preload images for better performance
export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

// Preload multiple images
export const preloadImages = async (srcs: string[]): Promise<void> => {
    await Promise.all(srcs.map(src => preloadImage(src).catch(() => {})));
};

// Get performance metrics
export const getPerformanceMetrics = () => {
    if (typeof window === 'undefined' || !window.performance) {
        return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navigation) {
        return null;
    }

    return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domComplete - navigation.domInteractive,
    };
};

// Log performance metrics (useful for development)
export const logPerformanceMetrics = () => {
    const metrics = getPerformanceMetrics();
    if (metrics) {
        console.group('🚀 Performance Metrics');
        console.table(metrics);
        console.groupEnd();
    }
};
