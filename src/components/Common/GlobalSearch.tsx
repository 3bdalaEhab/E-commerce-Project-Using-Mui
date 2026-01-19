import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Box,
    InputBase,
    IconButton,
    Paper,
    alpha,
    useTheme,
    Tooltip,
    ClickAwayListener,
    Fade,
    Typography,
    Divider,
    Avatar,
    CircularProgress,
    Stack,
    Chip,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {
    Search as SearchIcon,
    Close as CloseIcon,
    History as HistoryIcon,
    TrendingUp,
    Storefront,
    Category as CategoryIcon,
    KeyboardArrowRight,
    PriceCheck,
    Inventory
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { productService, categoryService } from "../../services";
import { Product, Category } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { storage } from "../../utils/storage";
import { logger } from "../../utils/logger";

// Debounce hook for performance
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const GlobalSearch: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [searchValue, setSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    // Debounce search value to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchValue.trim(), 300);

    // Fetch products with search
    const { data: productsData, isLoading: isLoadingProducts } = useQuery({
        queryKey: ["search-products", debouncedSearchTerm],
        queryFn: () => productService.getProducts({
            keyword: debouncedSearchTerm,
            limit: 6
        }),
        enabled: debouncedSearchTerm.length > 0,
        staleTime: 1000 * 60 * 2, // 2 minutes cache
    });

    // Fetch categories for category search
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getCategories(),
        staleTime: 1000 * 60 * 10, // 10 minutes cache
    });

    const suggestions = productsData?.data || [];
    const categories = categoriesData?.data || [];
    const isLoading = isLoadingProducts;

    // Filter matching categories
    const matchingCategories = debouncedSearchTerm.length > 0
        ? categories.filter((cat: Category) =>
            cat.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ).slice(0, 3)
        : [];

    // Load recent searches on mount
    useEffect(() => {
        const saved = storage.get<string[]>('recent_searches', []);
        if (saved && Array.isArray(saved)) {
            setRecentSearches(saved.slice(0, 8));
        }
    }, []);

    // Sync search value with URL if on products page
    useEffect(() => {
        if (location.pathname === '/products') {
            const params = new URLSearchParams(location.search);
            const query = params.get('keyword') || "";
            if (query !== searchValue && !isFocused) {
                setSearchValue(query);
            }
        }
    }, [location.pathname, location.search, isFocused, searchValue]);

    // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsFocused(true);
            }
            if (e.key === 'Escape' && isFocused) {
                setIsFocused(false);
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused]);

    // Keyboard navigation in suggestions
    useEffect(() => {
        if (!isFocused || selectedSuggestionIndex < 0) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const totalItems = suggestions.length + matchingCategories.length;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedSuggestionIndex((prev) => (prev + 1) % Math.max(totalItems, 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedSuggestionIndex((prev) => (prev - 1 + totalItems) % Math.max(totalItems, 1));
            } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
                e.preventDefault();
                const index = selectedSuggestionIndex;
                if (index < suggestions.length) {
                    handleSuggestionClick(suggestions[index]);
                } else {
                    const catIndex = index - suggestions.length;
                    if (matchingCategories[catIndex]) {
                        navigate(`/products?category=${matchingCategories[catIndex]._id}`);
                        setIsFocused(false);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, selectedSuggestionIndex, suggestions, matchingCategories]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedSuggestionIndex(-1);
    }, [debouncedSearchTerm]);

    const addToHistory = useCallback((query: string) => {
        if (!query.trim()) return;
        const updatedRecent = [
            query,
            ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())
        ].slice(0, 8);
        setRecentSearches(updatedRecent);
        storage.set("recent_searches", updatedRecent);
    }, [recentSearches]);

    const handleSearchSubmit = useCallback((query: string) => {
        if (!query.trim()) return;
        addToHistory(query);
        navigate(`/products?keyword=${encodeURIComponent(query)}`);
        setIsFocused(false);
        setSearchValue(query);
    }, [navigate, addToHistory]);

    const handleSuggestionClick = useCallback((product: Product) => {
        addToHistory(product.title);
        navigate(`/details/${product._id}`);
        setIsFocused(false);
        setSearchValue("");
    }, [navigate, addToHistory]);

    const handleCategoryClick = useCallback((categoryId: string, categoryName: string) => {
        addToHistory(categoryName);
        navigate(`/products?category=${categoryId}`);
        setIsFocused(false);
        setSearchValue("");
    }, [navigate, addToHistory]);

    const handleClear = useCallback(() => {
        setSearchValue("");
        setSelectedSuggestionIndex(-1);
        if (location.pathname === '/products') {
            navigate('/products');
        }
        inputRef.current?.focus();
    }, [location.pathname, navigate]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && selectedSuggestionIndex < 0) {
            handleSearchSubmit(searchValue);
        }
    };

    const removeFromHistory = useCallback((term: string) => {
        const updated = recentSearches.filter(s => s !== term);
        setRecentSearches(updated);
        storage.set('recent_searches', updated);
    }, [recentSearches]);

    const showSuggestions = isFocused && (searchValue.length > 0 || recentSearches.length > 0 || matchingCategories.length > 0);
    const hasResults = suggestions.length > 0 || matchingCategories.length > 0;
    const showNoResults = debouncedSearchTerm.length > 0 && !hasResults && !isLoading;

    return (
        <ClickAwayListener onClickAway={() => setIsFocused(false)}>
            <Box
                ref={containerRef}
                sx={{
                    position: 'relative',
                    width: { xs: '100%', sm: 'auto' },
                    maxWidth: { xs: '100%', md: '400px', lg: '500px' },
                    flex: 1,
                    mx: { xs: 1, md: 2 },
                    zIndex: 1300
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.8,
                        borderRadius: '16px',
                        border: `2px solid ${isFocused ? theme.palette.primary.main : theme.palette.divider}`,
                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: 'blur(16px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isFocused
                            ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`
                            : '0 2px 10px rgba(0,0,0,0.04)',
                        width: '100%',
                        '&:hover': {
                            borderColor: isFocused ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.5),
                        }
                    }}
                >
                    <SearchIcon
                        sx={{
                            color: isFocused ? 'primary.main' : 'text.disabled',
                            transition: 'color 0.3s',
                            fontSize: '1.3rem'
                        }}
                    />
                    <InputBase
                        inputRef={inputRef}
                        placeholder="Search products, categories..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setSelectedSuggestionIndex(-1);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleKeyDown}
                        sx={{
                            ml: 1.5,
                            flex: 1,
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            fontFamily: 'Outfit, sans-serif',
                            '& input::placeholder': {
                                color: 'text.disabled',
                                opacity: 0.7,
                            },
                        }}
                    />
                    {!isFocused && (
                        <Chip
                            label="⌘K"
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.text.disabled, 0.1),
                                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                display: { xs: 'none', md: 'flex' }
                            }}
                        />
                    )}
                    <AnimatePresence>
                        {isLoading ? (
                            <Fade in>
                                <CircularProgress size={20} thickness={4} sx={{ color: 'primary.main', mr: 1 }} />
                            </Fade>
                        ) : searchValue ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Tooltip title="Clear search">
                                    <IconButton size="small" onClick={handleClear} sx={{ p: 0.5 }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </Paper>

                {/* Enhanced Suggestions Dropdown */}
                <Fade in={showSuggestions} timeout={200}>
                    <Paper
                        elevation={8}
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% + 12px)',
                            left: 0,
                            right: 0,
                            maxHeight: '70vh',
                            overflow: 'auto',
                            borderRadius: '20px',
                            overflowX: 'hidden',
                            zIndex: 1400,
                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(30, 41, 59, 0.98)'
                                : 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 24px 60px -12px rgba(0,0,0,0.25)',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                borderRadius: '4px',
                                bgcolor: alpha(theme.palette.text.disabled, 0.3),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.text.disabled, 0.5),
                                }
                            }
                        }}
                    >
                        {/* Categories Section */}
                        {debouncedSearchTerm.length > 0 && matchingCategories.length > 0 && (
                            <Box sx={{ py: 1.5 }}>
                                <Typography
                                    variant="caption"
                                    fontWeight="700"
                                    color="primary"
                                    sx={{
                                        px: 2.5,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    <CategoryIcon fontSize="inherit" />
                                    CATEGORIES
                                </Typography>
                                {matchingCategories.map((category: Category, index: number) => {
                                    const itemIndex = index;
                                    const isSelected = selectedSuggestionIndex === itemIndex;
                                    return (
                                        <Box
                                            key={category._id}
                                            onClick={() => handleCategoryClick(category._id, category.name)}
                                            onMouseEnter={() => setSelectedSuggestionIndex(itemIndex)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                px: 2.5,
                                                py: 1.5,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    pl: 3,
                                                }
                                            }}
                                        >
                                            <Avatar
                                                src={category.image}
                                                variant="rounded"
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '10px',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                }}
                                            >
                                                <CategoryIcon />
                                            </Avatar>
                                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                <Typography variant="body2" fontWeight="600" noWrap>
                                                    {category.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Browse category
                                                </Typography>
                                            </Box>
                                            <KeyboardArrowRight sx={{ color: 'text.disabled', fontSize: '1.2rem' }} />
                                        </Box>
                                    );
                                })}
                                {suggestions.length > 0 && <Divider sx={{ my: 1, mx: 2 }} />}
                            </Box>
                        )}

                        {/* Products Suggestions */}
                        {debouncedSearchTerm.length > 0 && suggestions.length > 0 && (
                            <Box sx={{ py: 1 }}>
                                <Typography
                                    variant="caption"
                                    fontWeight="700"
                                    color="primary"
                                    sx={{
                                        px: 2.5,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    <TrendingUp fontSize="inherit" />
                                    PRODUCTS
                                </Typography>
                                {suggestions.map((product: Product, index: number) => {
                                    const itemIndex = matchingCategories.length + index;
                                    const isSelected = selectedSuggestionIndex === itemIndex;
                                    return (
                                        <Box
                                            key={product._id}
                                            onClick={() => handleSuggestionClick(product)}
                                            onMouseEnter={() => setSelectedSuggestionIndex(itemIndex)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                px: 2.5,
                                                py: 1.5,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                    pl: 3,
                                                }
                                            }}
                                        >
                                            <Avatar
                                                src={product.imageCover}
                                                variant="rounded"
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '10px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Box sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                                                <Typography variant="body2" fontWeight="600" noWrap>
                                                    {product.title}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary" noWrap>
                                                        {product.category?.name || 'Uncategorized'}
                                                    </Typography>
                                                    {product.ratingsAverage > 0 && (
                                                        <>
                                                            <Typography variant="caption" color="text.disabled">•</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ⭐ {product.ratingsAverage.toFixed(1)}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                {product.priceAfterDiscount ? (
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="700"
                                                            color="primary"
                                                        >
                                                            ${product.priceAfterDiscount}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                textDecoration: 'line-through',
                                                                color: 'text.disabled',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            ${product.price}
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2" fontWeight="700" color="primary">
                                                        ${product.price}
                                                    </Typography>
                                                )}
                                                {product.quantity === 0 && (
                                                    <Chip
                                                        label="Out of Stock"
                                                        size="small"
                                                        sx={{
                                                            height: 18,
                                                            fontSize: '0.65rem',
                                                            mt: 0.5,
                                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                                            color: theme.palette.error.main
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}

                        {/* No Results */}
                        {showNoResults && (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Storefront sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                                <Typography variant="body1" fontWeight="600" color="text.primary" gutterBottom>
                                    No results found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Try searching with different keywords
                                </Typography>
                            </Box>
                        )}

                        {/* Recent History (Only when input is empty) */}
                        {searchValue.length === 0 && recentSearches.length > 0 && (
                            <Box sx={{ py: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1 }}>
                                    <Typography variant="caption" fontWeight="700" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        RECENT SEARCHES
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="primary"
                                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setRecentSearches([]);
                                            storage.remove("recent_searches");
                                        }}
                                    >
                                        Clear all
                                    </Typography>
                                </Box>
                                {recentSearches.map((term, idx) => (
                                    <Box
                                        key={idx}
                                        onClick={() => handleSearchSubmit(term)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 1.5,
                                            px: 2.5,
                                            py: 1.2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                '& svg': { color: 'primary.main' },
                                                '& .delete-icon': { opacity: 1 }
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                                            <HistoryIcon fontSize="small" sx={{ color: 'text.disabled', transition: 'color 0.2s', flexShrink: 0 }} />
                                            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                                                {term}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            className="delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromHistory(term);
                                            }}
                                            sx={{
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                p: 0.5,
                                                color: 'text.disabled',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                    color: theme.palette.error.main
                                                }
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Footer Action */}
                        {searchValue.length > 0 && hasResults && (
                            <Box
                                onClick={() => handleSearchSubmit(searchValue)}
                                sx={{
                                    p: 1.5,
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08)
                                    }
                                }}
                            >
                                <Typography variant="body2" color="primary" fontWeight="600">
                                    View all results for "{searchValue}"
                                    <KeyboardArrowRight sx={{ verticalAlign: 'middle', ml: 0.5, fontSize: '1.2rem' }} />
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Fade>
            </Box>
        </ClickAwayListener>
    );
};

export default GlobalSearch;
