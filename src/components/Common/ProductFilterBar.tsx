import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    useTheme,
    Collapse,
    Slider,
    MenuItem,
    Menu,
    Fade
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface ProductFilterBarProps {
    onSort: (sortOption: string) => void;
    onPriceChange: (range: number[]) => void;
    minPrice?: number;
    maxPrice?: number;
}

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
    onSort,
    onPriceChange,
    minPrice = 0,
    maxPrice = 5000,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSortValue, setSelectedSortValue] = useState("");

    const sortOptions = [
        { label: t("filter.bestMatch"), value: "" },
        { label: t("filter.lowToHigh"), value: "price" },
        { label: t("filter.highToLow"), value: "-price" },
        { label: t("filter.topRated"), value: "-ratingsAverage" },
        { label: t("filter.bestSelling"), value: "-sold" },
    ];

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };

    const handlePriceCommit = () => {
        onPriceChange(priceRange);
    };

    const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortClose = (option?: { label: string, value: string }) => {
        setSortAnchorEl(null);
        if (option) {
            setSelectedSortValue(option.value);
            onSort(option.value);
        }
    };

    // Derive the label for the currently selected sort value
    const selectedSortLabel = sortOptions.find(opt => opt.value === selectedSortValue)?.label || t("filter.bestMatch");

    return (
        <Box sx={{ mb: 4, position: 'relative', zIndex: 10 }}>
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: '4px 6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        borderRadius: "100px",
                        background: theme.palette.mode === 'dark'
                            ? "rgba(30, 41, 59, 0.8)"
                            : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(12px)",
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.palette.mode === 'dark'
                            ? "0 4px 20px rgba(0,0,0,0.4)"
                            : "0 4px 20px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* Filter Toggle */}
                    <Box
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            px: 2,
                            py: 1,
                            borderRadius: '50px',
                            transition: 'all 0.2s',
                            bgcolor: showFilters ? 'primary.main' : 'transparent',
                            color: showFilters ? 'white' : 'text.primary',
                            '&:hover': {
                                bgcolor: showFilters ? 'primary.dark' : 'action.hover'
                            }
                        }}
                    >
                        {showFilters ? <CloseIcon fontSize="small" /> : <FilterListIcon fontSize="small" />}
                        <Typography variant="body2" fontWeight={600}>{t("filter.title")}</Typography>
                    </Box>

                    <Box sx={{ width: '1px', height: 24, bgcolor: 'divider' }} />

                    {/* Sort Menu */}
                    <Box
                        onClick={handleSortClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            px: 2,
                            py: 1,
                            borderRadius: '50px',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <SortIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight={600}>{selectedSortLabel}</Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Filter Content */}
            <Collapse in={showFilters} timeout={300}>
                <Box
                    sx={{
                        mt: 2,
                        width: '100%',
                        maxWidth: '500px',
                        mx: 'auto',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            background: theme.palette.mode === 'dark'
                                ? "rgba(30, 41, 59, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(16px)",
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)"
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {t("filter.priceRange")}
                            <Typography variant="caption" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, borderRadius: '4px' }}>
                                {priceRange[0]} {t("common.egp")} - {priceRange[1]} {t("common.egp")}
                            </Typography>
                        </Typography>

                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            onChangeCommitted={handlePriceCommit}
                            valueLabelDisplay="off"
                            min={0}
                            max={5000}
                            step={50}
                            sx={{
                                color: 'primary.main',
                                height: 6,
                                '& .MuiSlider-track': { border: 'none' },
                                '& .MuiSlider-thumb': {
                                    height: 20,
                                    width: 20,
                                    backgroundColor: '#fff',
                                    border: '2px solid currentColor',
                                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                        boxShadow: 'none',
                                    },
                                },
                            }}
                        />
                    </Paper>
                </Box>
            </Collapse>

            {/* Sort Menu Dropdown */}
            <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => handleSortClose()}
                TransitionComponent={Fade}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        mt: 1.5,
                        borderRadius: "16px",
                        minWidth: 180,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
                    }
                }}
            >
                {sortOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={() => handleSortClose(option)}
                        selected={selectedSortValue === option.value}
                        sx={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            py: 1,
                            gap: 1
                        }}
                    >
                        {selectedSortValue === option.value && <CheckIcon fontSize="small" color="primary" />}
                        <span style={{ flex: 1 }}>{option.label}</span>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default ProductFilterBar;
