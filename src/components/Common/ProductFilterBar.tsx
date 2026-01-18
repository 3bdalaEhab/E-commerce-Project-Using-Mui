import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Slider,
    Typography,
    Stack,
    IconButton,
    Paper,
    useTheme,
    Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFilterBarProps {
    onSearch: (query: string) => void;
    onSort: (sortOption: string) => void;
    onPriceChange: (range: number[]) => void;
    minPrice?: number;
    maxPrice?: number;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
    onSearch,
    onSort,
    onPriceChange,
    minPrice = 0,
    maxPrice = 5000,
}) => {
    const theme = useTheme();
    const [searchValue, setSearchValue] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
    const [sortValue, setSortValue] = useState("");

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchValue, onSearch]);

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };

    const handlePriceCommit = () => {
        onPriceChange(priceRange);
    };

    return (
        <Box sx={{ mb: 6, position: 'relative', zIndex: 10 }}>
            <Paper
                elevation={0}
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    p: 2,
                    borderRadius: "20px",
                    background: theme.palette.mode === 'dark'
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark'
                        ? "0 8px 32px rgba(0,0,0,0.3)"
                        : "0 8px 32px rgba(100,100,111,0.1)",
                }}
            >
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                    {/* Search Field */}
                    <TextField
                        fullWidth
                        placeholder="Search for premium products..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                backgroundColor: theme.palette.action.hover,
                                "& fieldset": { border: "none" },
                                "&:hover fieldset": { border: "none" },
                                "&.Mui-focused fieldset": { border: `1px solid ${theme.palette.primary.main}` },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Filter Toggle Button (Mobile/Tablet) */}
                    <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
                        <IconButton
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                borderRadius: "12px",
                                bgcolor: showFilters ? 'primary.main' : 'action.hover',
                                color: showFilters ? 'white' : 'text.primary',
                                border: `1px solid ${theme.palette.divider}`,
                                height: 56,
                                width: 56,
                                "&:hover": { bgcolor: showFilters ? 'primary.dark' : 'action.selected' }
                            }}
                        >
                            {showFilters ? <CloseIcon /> : <FilterListIcon />}
                        </IconButton>

                        {/* Sort Dropdown */}
                        <TextField
                            select
                            value={sortValue}
                            onChange={(e) => {
                                setSortValue(e.target.value);
                                onSort(e.target.value);
                            }}
                            SelectProps={{
                                displayEmpty: true
                            }}
                            sx={{
                                minWidth: 160,
                                flex: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    backgroundColor: theme.palette.action.hover,
                                    height: 56,
                                    "& fieldset": { border: "none" },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SortIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="" disabled>Sort By</MenuItem>
                            <MenuItem value="-sold">Best Selling</MenuItem>
                            <MenuItem value="-ratingsAverage">Top Rated</MenuItem>
                            <MenuItem value="price">Price: Low to High</MenuItem>
                            <MenuItem value="-price">Price: High to Low</MenuItem>
                        </TextField>
                    </Box>
                </Stack>

                {/* Collapsible Filters */}
                <Collapse in={showFilters}>
                    <Box sx={{ mt: 3, p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="subtitle2" fontWeight="800" gutterBottom>
                            Price Range (${priceRange[0]} - ${priceRange[1]})
                        </Typography>
                        <Box sx={{ px: 2 }}>
                            <Slider
                                getAriaLabel={() => "Price range"}
                                value={priceRange}
                                onChange={handlePriceChange}
                                onChangeCommitted={handlePriceCommit}
                                valueLabelDisplay="auto"
                                min={0}
                                max={5000}
                                step={50}
                                sx={{
                                    color: 'primary.main',
                                    height: 8,
                                    '& .MuiSlider-track': { border: 'none' },
                                    '& .MuiSlider-thumb': {
                                        height: 24,
                                        width: 24,
                                        backgroundColor: '#fff',
                                        border: '2px solid currentColor',
                                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                            boxShadow: 'inherit',
                                        },
                                        '&:before': { display: 'none' },
                                    },
                                    '& .MuiSlider-valueLabel': {
                                        lineHeight: 1.2,
                                        fontSize: 12,
                                        background: 'unset',
                                        padding: 0,
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50% 50% 50% 0',
                                        backgroundColor: theme.palette.primary.main,
                                        transformOrigin: 'bottom left',
                                        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                                        '&:before': { display: 'none' },
                                        '&.MuiSlider-valueLabelOpen': {
                                            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                                        },
                                        '& > *': {
                                            transform: 'rotate(45deg)',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        </Box>
    );
};

export default ProductFilterBar;
