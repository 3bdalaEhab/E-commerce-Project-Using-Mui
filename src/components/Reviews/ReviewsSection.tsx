import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    useTheme,
    alpha,
    Divider,
    Skeleton,
    Chip,
    Paper,
    IconButton,
} from '@mui/material';
import {
    SortRounded,
    FilterList,
    Star,
    ChevronLeft,
    ChevronRight,
    RateReview,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import StarRating from './StarRating';
import ReviewCard, { Review } from './ReviewCard';

interface ReviewsSectionProps {
    reviews: Review[];
    loading?: boolean;
    averageRating?: number;
    totalReviews?: number;
    onHelpful?: (reviewId: string) => void;
    onNotHelpful?: (reviewId: string) => void;
}

type SortOption = 'recent' | 'helpful' | 'highest' | 'lowest';

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    reviews,
    loading = false,
    averageRating = 0,
    totalReviews = 0,
    onHelpful,
    onNotHelpful,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [sortBy, setSortBy] = React.useState<SortOption>('recent');
    const [filterRating, setFilterRating] = React.useState<number | 'all'>('all');

    // Calculate rating distribution
    const ratingDistribution = useMemo(() => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((review) => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                distribution[rating as keyof typeof distribution]++;
            }
        });
        return distribution;
    }, [reviews]);

    // Sort and filter reviews
    const displayedReviews = useMemo(() => {
        let filtered = [...reviews];

        // Apply rating filter
        if (filterRating !== 'all') {
            filtered = filtered.filter((r) => Math.round(r.rating) === filterRating);
        }

        // Apply sorting
        switch (sortBy) {
            case 'helpful':
                filtered.sort((a, b) => b.helpful - a.helpful);
                break;
            case 'highest':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filtered;
    }, [reviews, sortBy, filterRating]);

    return (
        <Box sx={{ py: 4 }}>
            {/* Section Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight={700}>
                    {t('reviews.customerReviews') || 'Customer Reviews'}
                </Typography>
            </Box>

            {/* Rating Summary */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    gap: 4,
                    flexWrap: 'wrap',
                }}
            >
                {/* Average Rating */}
                <Box sx={{ textAlign: 'center', minWidth: 150 }}>
                    <Typography variant="h2" fontWeight={700} color="primary">
                        {averageRating.toFixed(1)}
                    </Typography>
                    <StarRating value={averageRating} readonly size="medium" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t('reviews.basedOn', { count: totalReviews }) || `Based on ${totalReviews} reviews`}
                    </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* Rating Distribution */}
                <Box sx={{ flex: 1, minWidth: 250 }}>
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                        return (
                            <Box
                                key={rating}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 1,
                                    cursor: 'pointer',
                                    opacity: filterRating === 'all' || filterRating === rating ? 1 : 0.5,
                                    transition: 'opacity 0.2s',
                                    '&:hover': { opacity: 1 },
                                }}
                                onClick={() => setFilterRating(filterRating === rating ? 'all' : rating)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 40 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {rating}
                                    </Typography>
                                    <Star sx={{ fontSize: 16, color: '#FFB800' }} />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={percentage}
                                    sx={{
                                        flex: 1,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            bgcolor: '#FFB800',
                                        },
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                                    {count}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Paper>

            {/* Filters & Sort */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>{t('reviews.sortBy') || 'Sort By'}</InputLabel>
                    <Select
                        value={sortBy}
                        label={t('reviews.sortBy') || 'Sort By'}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        startAdornment={<SortRounded sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                        <MenuItem value="recent">{t('reviews.mostRecent') || 'Most Recent'}</MenuItem>
                        <MenuItem value="helpful">{t('reviews.mostHelpful') || 'Most Helpful'}</MenuItem>
                        <MenuItem value="highest">{t('reviews.highestRated') || 'Highest Rated'}</MenuItem>
                        <MenuItem value="lowest">{t('reviews.lowestRated') || 'Lowest Rated'}</MenuItem>
                    </Select>
                </FormControl>

                {filterRating !== 'all' && (
                    <Chip
                        icon={<FilterList />}
                        label={`${filterRating} ${t('reviews.stars') || 'Stars'}`}
                        onDelete={() => setFilterRating('all')}
                        color="primary"
                        variant="outlined"
                    />
                )}

                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    {t('reviews.showing', { count: displayedReviews.length, total: reviews.length }) ||
                        `Showing ${displayedReviews.length} of ${reviews.length} reviews`}
                </Typography>
            </Box>

            {/* Reviews Slider */}
            {loading ? (
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={250} width="100%" sx={{ borderRadius: 3, flex: '0 0 calc(33.33% - 16px)' }} />
                    ))}
                </Box>
            ) : displayedReviews.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <RateReview sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {filterRating !== 'all'
                            ? t('reviews.noReviewsForRating') || 'No reviews for this rating'
                            : t('reviews.noReviews') || 'No reviews yet'}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        {t('reviews.beFirst') || 'Be the first to share your experience!'}
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ position: 'relative', px: { xs: 0, md: 5 } }}>
                    {/* Custom Navigation Buttons */}
                    <IconButton
                        className="reviews-swiper-prev"
                        sx={{
                            position: 'absolute',
                            left: { xs: -16, md: -10 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : 'background.paper',
                            boxShadow: 3,
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                            display: { xs: 'none', sm: 'flex' },
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <IconButton
                        className="reviews-swiper-next"
                        sx={{
                            position: 'absolute',
                            right: { xs: -16, md: -10 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.9) : 'background.paper',
                            boxShadow: 3,
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                            display: { xs: 'none', sm: 'flex' },
                        }}
                    >
                        <ChevronRight />
                    </IconButton>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={displayedReviews.length > 3}
                        navigation={{
                            prevEl: '.reviews-swiper-prev',
                            nextEl: '.reviews-swiper-next',
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                        }}
                        style={{
                            paddingBottom: '48px',
                            paddingTop: '8px',
                        }}
                    >
                        {displayedReviews.map((review) => (
                            <SwiperSlide
                                key={review._id}
                                style={{ height: 'auto' }}
                            >
                                <ReviewCard
                                    review={review}
                                    onHelpful={onHelpful}
                                    onNotHelpful={onNotHelpful}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            )}
        </Box>
    );
};

export default ReviewsSection;
