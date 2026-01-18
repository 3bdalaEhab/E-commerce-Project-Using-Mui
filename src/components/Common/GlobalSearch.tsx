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
    Stack
} from "@mui/material";
import {
    Search as SearchIcon,
    Close as CloseIcon,
    History as HistoryIcon,
    TrendingUp,
    Storefront
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../../services";
import { Product } from "../../types";

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

    const [searchValue, setSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Autocomplete States
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce search value to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchValue, 400);

    // Load recent searches on mount
    useEffect(() => {
        const saved = localStorage.getItem("recent_searches");
        if (saved) {
            setRecentSearches(JSON.parse(saved).slice(0, 5));
        }
    }, []);

    // Sync search value with URL if on products page
    useEffect(() => {
        if (location.pathname === '/products') {
            const params = new URLSearchParams(location.search);
            const query = params.get('keyword') || "";
            // Only update if significantly different to avoid conflict with typing
            if (query !== searchValue && !isFocused) {
                setSearchValue(query);
            }
        }
    }, [location.pathname, location.search, isFocused]);

    // Fetch Suggestions Effect
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!debouncedSearchTerm.trim()) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch top 5 matching products
                const response = await productService.getProducts({
                    keyword: debouncedSearchTerm,
                    limit: 5
                });
                if (response && response.data) {
                    setSuggestions(response.data);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearchTerm]);

    const addToHistory = (query: string) => {
        const updatedRecent = [
            query,
            ...recentSearches.filter(s => s !== query)
        ].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem("recent_searches", JSON.stringify(updatedRecent));
    };

    const handleSearchSubmit = useCallback((query: string) => {
        if (!query.trim()) return;
        addToHistory(query);
        navigate(`/products?keyword=${encodeURIComponent(query)}`);
        setIsFocused(false);
    }, [navigate, recentSearches]);

    const handleSuggestionClick = (product: Product) => {
        addToHistory(product.title); // Optionally add to history
        navigate(`/details/${product._id}`); // Go straight to details
        setIsFocused(false);
    };

    const handleClear = () => {
        setSearchValue("");
        setSuggestions([]);
        if (location.pathname === '/products') {
            navigate('/products');
        }
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(searchValue);
        }
    };

    const showSuggestions = isFocused && (searchValue.length > 0 || recentSearches.length > 0);

    return (
        <ClickAwayListener onClickAway={() => setIsFocused(false)}>
            <Box sx={{ position: 'relative', width: { xs: 'auto', md: '300px', lg: '400px' }, flex: 1, mx: { xs: 1, md: 2 }, zIndex: 1300 }}>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.8,
                        borderRadius: '16px',
                        border: `1px solid ${isFocused ? theme.palette.primary.main : theme.palette.divider}`,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(12px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isFocused
                            ? `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`
                            : '0 2px 10px rgba(0,0,0,0.02)',
                        width: '100%',
                    }}
                >
                    <SearchIcon
                        sx={{
                            color: isFocused ? 'primary.main' : 'text.disabled',
                            transition: 'color 0.3s'
                        }}
                    />
                    <InputBase
                        inputRef={inputRef}
                        placeholder="Search for premium products..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
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
                                opacity: 0.8,
                            },
                        }}
                    />
                    <AnimatePresence>
                        {isLoading ? (
                            <Fade in>
                                <CircularProgress size={20} thickness={4} sx={{ color: 'text.disabled', mr: 1 }} />
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

                {/* Suggestions Dropdown */}
                <Fade in={showSuggestions} timeout={200}>
                    <Paper
                        elevation={8}
                        sx={{
                            position: 'absolute',
                            top: 'calc(100% + 12px)',
                            left: 0,
                            right: 0,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            zIndex: 1400,
                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(30, 41, 59, 0.95)'
                                : 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Live Product Suggestions */}
                        {searchValue.length > 0 && suggestions.length > 0 && (
                            <Box sx={{ py: 1 }}>
                                <Typography variant="caption" fontWeight="700" color="primary" sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUp fontSize="inherit" />
                                    TOP SUGGESTIONS
                                </Typography>
                                {suggestions.map((product) => (
                                    <Box
                                        key={product._id}
                                        onClick={() => handleSuggestionClick(product)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            px: 2,
                                            py: 1.5,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                pl: 2.5
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={product.imageCover}
                                            variant="rounded"
                                            sx={{ width: 40, height: 40, borderRadius: '8px' }}
                                        />
                                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                            <Typography variant="body2" fontWeight="600" noWrap>
                                                {product.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {product.category.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="700" color="primary">
                                            ${product.price}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* No Results Fallback */}
                        {searchValue.length > 0 && suggestions.length === 0 && !isLoading && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No products found for "{searchValue}"
                                </Typography>
                            </Box>
                        )}

                        {/* Recent History (Only when input is empty) */}
                        {searchValue.length === 0 && recentSearches.length > 0 && (
                            <Box sx={{ py: 1 }}>
                                <Typography variant="caption" fontWeight="700" color="text.disabled" sx={{ px: 2, py: 1, display: 'block' }}>
                                    RECENT SEARCHES
                                </Typography>
                                {recentSearches.map((term, idx) => (
                                    <Box
                                        key={idx}
                                        onClick={() => handleSearchSubmit(term)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            px: 2,
                                            py: 1.2,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                '& svg': { color: 'primary.main' }
                                            }
                                        }}
                                    >
                                        <HistoryIcon fontSize="small" sx={{ color: 'text.disabled', transition: 'color 0.2s' }} />
                                        <Typography variant="body2">{term}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Footer Action */}
                        {searchValue.length > 0 && (
                            <Box
                                onClick={() => handleSearchSubmit(searchValue)}
                                sx={{
                                    p: 1.5,
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                                    }
                                }}
                            >
                                <Typography variant="body2" color="primary" fontWeight="600">
                                    View all results for "{searchValue}"
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
