import React from "react";
import { Box, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { sliderImages } from "../../constants/sliderData";
import SlideItem from "./SlideItem";
import SideImages from "./SideImages";

export default function CategoriesSlider() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                gap: 3,
                alignItems: "stretch",
                mt: { xs: 3, md: 5 },
                flexWrap: { xs: "wrap", md: "nowrap" },
                px: { xs: 2, md: 4 },
                maxWidth: "1600px",
                mx: "auto",
                "& .swiper-button-next, & .swiper-button-prev": {
                    color: "#fff",
                    bgcolor: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(8px)",
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    transition: "all 0.3s ease",
                    "&::after": { fontSize: "1.2rem", fontWeight: "bold" },
                    "&:hover": {
                        bgcolor: theme.palette.primary.main,
                        transform: "scale(1.1)",
                    },
                    opacity: 0,
                },
                "&:hover .swiper-button-next, &:hover .swiper-button-prev": { opacity: 1 },
                "& .swiper-pagination-bullet": {
                    bgcolor: "#fff",
                    opacity: 0.5,
                    width: "10px",
                    height: "10px",
                },
                "& .swiper-pagination-bullet-active": {
                    bgcolor: theme.palette.primary.main,
                    opacity: 1,
                    width: "24px",
                    borderRadius: "5px",
                },
            }}
        >
            {/* Main Slider Area */}
            <Box
                sx={{
                    flex: 3,
                    borderRadius: "24px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 10px 40px rgba(0,0,0,0.4)"
                            : "0 10px 40px rgba(0,0,0,0.08)",
                }}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    navigation
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop
                    effect="fade"
                    style={{ height: "100%" }}
                >
                    {sliderImages.map((img, index) => (
                        <SwiperSlide key={img.title + index}>
                            <SlideItem img={img} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            {/* Side Images Area */}
            <SideImages />
        </Box>
    );
}
