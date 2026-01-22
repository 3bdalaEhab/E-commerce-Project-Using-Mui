import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
    showValue?: boolean;
    precision?: 0.5 | 1;
    color?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    readonly = false,
    size = 'medium',
    precision = 1,
    color = '#FFB800',
}) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const sizeMap = {
        small: 20,
        medium: 28,
        large: 36,
    };

    const iconSize = sizeMap[size];

    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleMouseMove = useCallback(
        (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
            if (readonly) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const isHalf = precision === 0.5 && x < rect.width / 2;
            setHoverValue(starIndex + (isHalf ? 0.5 : 1));
        },
        [readonly, precision]
    );

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
            if (readonly || !onChange) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const isHalf = precision === 0.5 && x < rect.width / 2;
            onChange(starIndex + (isHalf ? 0.5 : 1));
        },
        [readonly, onChange, precision]
    );

    const handleMouseLeave = useCallback(() => {
        setHoverValue(null);
    }, []);

    const stars = useMemo(() => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = displayValue >= starValue;
            const isHalfFilled = displayValue >= starValue - 0.5 && displayValue < starValue;

            return (
                <Box
                    key={index}
                    component={motion.div}
                    whileHover={readonly ? {} : { scale: 1.2 }}
                    whileTap={readonly ? {} : { scale: 0.9 }}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onClick={(e) => handleClick(e, index)}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                        cursor: readonly ? 'default' : 'pointer',
                        display: 'inline-flex',
                        position: 'relative',
                    }}
                >
                    {isFilled ? (
                        <Star
                            sx={{
                                fontSize: iconSize,
                                color: color,
                                filter: 'drop-shadow(0 2px 4px rgba(255, 184, 0, 0.3))',
                            }}
                        />
                    ) : isHalfFilled ? (
                        <StarHalf
                            sx={{
                                fontSize: iconSize,
                                color: color,
                                filter: 'drop-shadow(0 2px 4px rgba(255, 184, 0, 0.3))',
                            }}
                        />
                    ) : (
                        <StarBorder
                            sx={{
                                fontSize: iconSize,
                                color: color,
                                opacity: 0.4,
                            }}
                        />
                    )}
                </Box>
            );
        });
    }, [displayValue, iconSize, color, readonly, handleMouseMove, handleClick, handleMouseLeave]);

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.25,
            }}
            onMouseLeave={handleMouseLeave}
        >
            {stars}
        </Box>
    );
};

export default StarRating;
