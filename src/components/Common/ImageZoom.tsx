import React, { useState } from 'react';
import { Box } from '@mui/material';

interface ImageZoomProps {
    src: string;
    alt: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
        setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: 'crosshair',
            }}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={src}
                alt={alt}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            {showZoom && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundSize: '250%', // Zoom level
                        zIndex: 10,
                        backgroundColor: 'white' // Fallback to cover original
                    }}
                />
            )}
        </Box>
    );
};

export default ImageZoom;
