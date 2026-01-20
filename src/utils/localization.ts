import i18n from '../i18n/i18n';

/**
 * Sanitizes a string for use as a translation key.
 * Example: "Men's Fashion" -> "mensFashion"
 */
const sanitizeKey = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/'/g, '') // Remove apostrophes first (e.g., Men's -> mens)
        .replace(/[^a-z0-9]/g, ' ') // Replace other non-alphanumeric with spaces
        .trim()
        .split(/\s+/)
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

/**
 * Professional helper to translate API-driven content (names, categories).
 * If no translation is found, it gracefully falls back to the original text.
 * 
 * @param text The original text from API (usually English)
 * @param namespace The i18n namespace (e.g., 'categories', 'products')
 */
export const translateAPIContent = (text: string | undefined, namespace: string): string => {
    if (!text) return '';

    const key = sanitizeKey(text);
    const fullKey = `${namespace}.${key}`;
    const translation = i18n.t(fullKey);

    // If translation is the same as the key (i18next default behavior when key missing),
    // return the original API text.
    // If translation is the same as the key (i18next default behavior when key missing),
    // return the original API text.
    if (translation === fullKey) {
        return text;
    }

    return translation;
};

/**
 * Helper to translate product descriptions using the product title convention.
 * Convention: products.[camelCaseTitle]Description
 */
export const translateProductDescription = (title: string, originalDescription: string): string => {
    if (!title) return originalDescription;

    const baseKey = sanitizeKey(title);
    const fullKey = `products.${baseKey}Description`;
    const translation = i18n.t(fullKey);

    if (translation === fullKey) {
        // console.warn(`[Localization] Missing description key: ${fullKey}`);
        return originalDescription;
    }

    return translation;
};
