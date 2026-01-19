import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Chip,
    Stack,
    Skeleton,
    alpha,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services';
import { motion } from 'framer-motion';

const CategoryQuickNav: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getCategories(),
        select: (data) => data.data
    });

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} variant="rounded" width={100} height={40} sx={{ borderRadius: '12px' }} />
                    ))}
                </Stack>
            </Container>
        );
    }

    return (
        <Box sx={{ mb: 8 }}>
            <Container maxWidth="lg">
                <Stack
                    direction="row"
                    spacing={1.5}
                    justifyContent="center"
                    sx={{
                        overflowX: 'auto',
                        pb: 2,
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }}
                >
                    {categoriesData?.map((category, index) => (
                        <motion.div
                            key={category._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Chip
                                label={category.name}
                                onClick={() => navigate(`/products?category=${category._id}`)}
                                sx={{
                                    px: 2,
                                    py: 3,
                                    fontSize: '0.95rem',
                                    fontWeight: 800,
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    bgcolor: 'background.paper',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.main,
                                        color: 'white',
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        borderColor: 'transparent'
                                    },
                                    '& .MuiChip-label': {
                                        px: 1
                                    }
                                }}
                            />
                        </motion.div>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default CategoryQuickNav;
