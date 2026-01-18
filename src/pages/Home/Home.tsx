import React from 'react';
import CategoriesSlider from '../../components/CategoriesSlider/CategoriesSlider';
import PageMeta from '../../components/PageMeta/PageMeta';
import Products from '../Products/Products';

const Home: React.FC = () => {
    return (
        <>
            <PageMeta
                title="Home"
                description="Welcome to our store. Explore the best products available."
            />
            {/* 🔹 Categories slider component */}
            <CategoriesSlider />
            <Products />
        </>
    );
};

export default Home;
