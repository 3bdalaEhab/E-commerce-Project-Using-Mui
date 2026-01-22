import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Skeleton,
    Breadcrumbs,
    Link as MuiLink,
    useTheme,
    alpha,
    Chip,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../../services';
import PageMeta from '../../components/PageMeta/PageMeta';
import { translateAPIContent } from '../../utils/localization';
import { SubCategory } from '../../types';

const SubCategories: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation();

    // Fetch category details
    const { data: category, isLoading: categoryLoading } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => categoryService.getCategoryById(categoryId as string),
        enabled: !!categoryId,
        select: (data) => data.data,
    });

    // Fetch subcategories for this category
    const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
        queryKey: ['subcategories', categoryId],
        queryFn: () => categoryService.getSubCategoriesForCategory(categoryId as string),
        enabled: !!categoryId,
        select: (data) => data.data,
    });

    const isLoading = categoryLoading || subcategoriesLoading;

    const handleSubcategoryClick = (subcategoryId: string) => {
        navigate(`/products?subcategory=${subcategoryId}`);
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
            <PageMeta
                title={category ? `${translateAPIContent(category.name, 'categories')} - ${t('PageMeta.categoriesTitle')}` : t('PageMeta.categoriesTitle')}
                description={t('PageMeta.categoriesDesc')}
            />

            <Container maxWidth="lg">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 4 }}
                >
                    <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
                        {t('nav.home')}
                    </MuiLink>
                    <MuiLink component={RouterLink} to="/categories" underline="hover" color="inherit">
                        {t('nav.categories')}
                    </MuiLink>
                    <Typography color="text.primary" fontWeight={600}>
                        {category ? translateAPIContent(category.name, 'categories') : '...'}
                    </Typography>
                </Breadcrumbs>

                {/* Header */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{
                                mb: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {category ? translateAPIContent(category.name, 'categories') : t('categories.title')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            {t('subcategories.subtitle') || 'Explore specialized collections within this category'}
                        </Typography>
                    </motion.div>
                </Box>

                {/* Subcategories Grid */}
                {isLoading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Skeleton
                                    variant="rounded"
                                    height={200}
                                    sx={{ borderRadius: 4 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : subcategories && subcategories.length > 0 ? (
                    <Grid container spacing={3}>
                        {subcategories.map((subcategory: SubCategory, index: number) => (
                            <Grid key={subcategory._id} size={{ xs: 12, sm: 6, md: 4 }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 4,
                                            border: `1px solid ${theme.palette.divider}`,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleSubcategoryClick(subcategory._id)}>
                                            <Box
                                                sx={{
                                                    height: 160,
                                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Typography
                                                    variant="h2"
                                                    sx={{
                                                        fontSize: 80,
                                                        opacity: 0.1,
                                                        fontWeight: 900,
                                                        position: 'absolute',
                                                    }}
                                                >
                                                    {subcategory.name?.charAt(0)}
                                                </Typography>
                                                <Chip
                                                    label={t('subcategories.browseNow') || 'Browse Now'}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 12,
                                                        right: 12,
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Box>
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                                    {translateAPIContent(subcategory.name, 'subcategories')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {t('subcategories.exploreProducts') || 'Explore products in this collection'}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h6" color="text.secondary">
                            {t('subcategories.noSubcategories') || 'No subcategories found in this category'}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default SubCategories;
