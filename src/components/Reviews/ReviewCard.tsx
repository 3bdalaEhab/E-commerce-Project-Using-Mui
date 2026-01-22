import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    useTheme,
    alpha,
    Divider,
} from '@mui/material';
import {
    ThumbUpAltOutlined,
    ThumbUpAlt,
    ThumbDownAltOutlined,
    ThumbDownAlt,
    VerifiedUser,
    MoreVert,
    FormatQuote,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import { useAuth, useToast } from '../../Context';

export interface Review {
    _id: string;
    userId: {
        _id: string;
        name: string;
        avatar?: string;
        country?: string; // ISO 3166-1 alpha-2 code
    };
    productId: string;
    rating: number;
    title: string;
    content: string;
    images?: string[];
    verifiedPurchase: boolean;
    helpful: number;
    notHelpful: number;
    createdAt: string;
}

interface ReviewCardProps {
    review: Review;
    onHelpful?: (reviewId: string) => void;
    onNotHelpful?: (reviewId: string) => void;
    onReport?: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    onHelpful,
    onNotHelpful,
    onReport,
}) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const { userToken } = useAuth();
    const { showToast } = useToast();
    const isRTL = i18n.language === 'ar';
    const isLoggedIn = !!userToken;

    // State for like/dislike functionality
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
    const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
    const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpful || 0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t('reviews.today') || 'Today';
        if (diffDays === 1) return t('reviews.yesterday') || 'Yesterday';
        if (diffDays < 7) return `${diffDays} ${t('reviews.daysAgo') || 'days ago'}`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${t('reviews.weeksAgo') || 'weeks ago'}`;
        return formatDate(dateString);
    };

    const handleLike = () => {
        // Check if user is logged in
        if (!isLoggedIn) {
            showToast(
                t('reviews.loginRequired') || 'Please login to rate reviews',
                'info'
            );
            return;
        }

        if (userReaction === 'like') {
            // Remove like
            setUserReaction(null);
            setHelpfulCount(prev => prev - 1);
        } else if (userReaction === 'dislike') {
            // Switch from dislike to like
            setUserReaction('like');
            setHelpfulCount(prev => prev + 1);
            setNotHelpfulCount(prev => prev - 1);
        } else {
            // Add like
            setUserReaction('like');
            setHelpfulCount(prev => prev + 1);
        }
        onHelpful?.(review._id);
    };

    const handleDislike = () => {
        // Check if user is logged in
        if (!isLoggedIn) {
            showToast(
                t('reviews.loginRequired') || 'Please login to rate reviews',
                'info'
            );
            return;
        }

        if (userReaction === 'dislike') {
            // Remove dislike
            setUserReaction(null);
            setNotHelpfulCount(prev => prev - 1);
        } else if (userReaction === 'like') {
            // Switch from like to dislike
            setUserReaction('dislike');
            setNotHelpfulCount(prev => prev + 1);
            setHelpfulCount(prev => prev - 1);
        } else {
            // Add dislike
            setUserReaction('dislike');
            setNotHelpfulCount(prev => prev + 1);
        }
        onNotHelpful?.(review._id);
    };

    // Get rating color based on value
    const getRatingColor = (rating: number) => {
        if (rating >= 4) return theme.palette.success.main;
        if (rating >= 3) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return (
        <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                transition: 'all 0.3s ease',
                height: '100%',
                minHeight: 320,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    transform: 'translateY(-4px)',
                },
            }}
        >
            {/* Quote Icon - Decorative */}
            <FormatQuote
                sx={{
                    position: 'absolute',
                    top: 8,
                    [isRTL ? 'left' : 'right']: 8,
                    fontSize: 40,
                    color: alpha(theme.palette.primary.main, 0.08),
                    transform: isRTL ? 'scaleX(-1)' : 'none',
                }}
            />

            {/* Header - User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar
                    src={review.userId?.avatar}
                    sx={{
                        width: 44,
                        height: 44,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                >
                    {review.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 120,
                            }}
                        >
                            {review.userId?.name || 'Anonymous'}
                        </Typography>
                        {review.userId?.country && (
                            <Box component="span" sx={{ fontSize: '0.9rem' }}>
                                {review.userId.country.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))}
                            </Box>
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {getTimeAgo(review.createdAt)}
                    </Typography>
                </Box>
                <Tooltip title={t('reviews.report') || 'Report'}>
                    <IconButton size="small" onClick={() => onReport?.(review._id)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Rating & Verified Badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            bgcolor: alpha(getRatingColor(review.rating), 0.1),
                            px: 1,
                            py: 0.3,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        <StarRating value={review.rating} readonly size="small" />
                        <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{ color: getRatingColor(review.rating) }}
                        >
                            {review.rating.toFixed(1)}
                        </Typography>
                    </Box>
                </Box>
                {review.verifiedPurchase && (
                    <Chip
                        icon={<VerifiedUser sx={{ fontSize: 12 }} />}
                        label={t('reviews.verified') || 'Verified'}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{
                            height: 20,
                            '& .MuiChip-label': { px: 0.5, fontSize: '0.65rem' },
                            '& .MuiChip-icon': { ml: 0.5 },
                        }}
                    />
                )}
            </Box>

            {/* Title */}
            <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                    lineHeight: 1.3,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {review.title}
            </Typography>

            {/* Content */}
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    lineHeight: 1.6,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '0.85rem',
                }}
            >
                {review.content}
            </Typography>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                    {review.images.slice(0, 3).map((image, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={image}
                            alt={`Review image ${index + 1}`}
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1.5,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: `1px solid ${theme.palette.divider}`,
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                        />
                    ))}
                    {review.images.length > 3 && (
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <Typography variant="caption" color="primary" fontWeight={600}>
                                +{review.images.length - 3}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* Footer - Helpful buttons */}
            <Divider sx={{ mt: 'auto', pt: 1.5 }} />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pt: 1.5,
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {t('reviews.wasHelpful') || 'Was this helpful?'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {/* Like Button */}
                    <Box
                        component={motion.div}
                        whileTap={{ scale: 0.9 }}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <IconButton
                            size="small"
                            onClick={handleLike}
                            sx={{
                                color: userReaction === 'like'
                                    ? theme.palette.success.main
                                    : 'inherit',
                                bgcolor: userReaction === 'like'
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.success.main, 0.15),
                                    color: theme.palette.success.main,
                                },
                            }}
                        >
                            {userReaction === 'like' ? (
                                <ThumbUpAlt sx={{ fontSize: 18 }} />
                            ) : (
                                <ThumbUpAltOutlined sx={{ fontSize: 18 }} />
                            )}
                        </IconButton>
                        <Typography
                            variant="caption"
                            sx={{
                                ml: 0.25,
                                fontWeight: userReaction === 'like' ? 700 : 400,
                                color: userReaction === 'like'
                                    ? theme.palette.success.main
                                    : 'text.secondary',
                                minWidth: 16,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {helpfulCount > 0 ? helpfulCount : ''}
                        </Typography>
                    </Box>

                    {/* Dislike Button */}
                    <Box
                        component={motion.div}
                        whileTap={{ scale: 0.9 }}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <IconButton
                            size="small"
                            onClick={handleDislike}
                            sx={{
                                color: userReaction === 'dislike'
                                    ? theme.palette.error.main
                                    : 'inherit',
                                bgcolor: userReaction === 'dislike'
                                    ? alpha(theme.palette.error.main, 0.1)
                                    : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.error.main, 0.15),
                                    color: theme.palette.error.main,
                                },
                            }}
                        >
                            {userReaction === 'dislike' ? (
                                <ThumbDownAlt sx={{ fontSize: 18 }} />
                            ) : (
                                <ThumbDownAltOutlined sx={{ fontSize: 18 }} />
                            )}
                        </IconButton>
                        <Typography
                            variant="caption"
                            sx={{
                                ml: 0.25,
                                fontWeight: userReaction === 'dislike' ? 700 : 400,
                                color: userReaction === 'dislike'
                                    ? theme.palette.error.main
                                    : 'text.secondary',
                                minWidth: 16,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {notHelpfulCount > 0 ? notHelpfulCount : ''}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default ReviewCard;
