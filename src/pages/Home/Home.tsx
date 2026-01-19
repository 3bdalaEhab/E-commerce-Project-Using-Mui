import React from 'react';
import CategoriesSlider from '../../components/CategoriesSlider/CategoriesSlider';
import PageMeta from '../../components/PageMeta/PageMeta';
import Products from '../Products/Products';
import HomeHero from '../../components/Home/HomeHero';
import { Box, Typography, Container } from '@mui/material';
import ErrorBoundary from '../../components/Common/ErrorBoundary';

const Home: React.FC = () => {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            <PageMeta
                title="Elite Store | Premium Shopping Experience"
                description="Welcome to our store. Explore the best products available with elite service."
            />

            {/* 🛡️ Hero Section & Global Search */}
            <HomeHero />

            {/* 🎡 Featured Categories Slider */}
            <Box sx={{ mb: 10 }}>
                <Container maxWidth="xl">
                    <Typography
                        variant="h4"
                        fontWeight="1000"
                        sx={{ mb: 4, px: { xs: 2, md: 4 }, letterSpacing: -1 }}
                    >
                        Trending Categories
                    </Typography>
                </Container>
                <ErrorBoundary>
                    <CategoriesSlider />
                </ErrorBoundary>
            </Box>

            {/* 📦 All Products Listing */}
            <Box id="all-products">
                <Container maxWidth="xl">
                    <Typography
                        variant="h4"
                        fontWeight="1000"
                        sx={{ mb: 4, px: { xs: 2, md: 4 }, letterSpacing: -1 }}
                    >
                        Explore Our Collection
                    </Typography>
                </Container>
                <ErrorBoundary>
                    <Products />
                </ErrorBoundary>
            </Box>
        </Box>
    );
};

export default Home;
