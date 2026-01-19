import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade, Parallax } from "swiper/modules";
import { motion } from "framer-motion";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";


export default React.memo(function CategoriesSlider() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const SLIDER_DATA = React.useMemo(() => [
        {
            id: 1,
            title: t("slides.minimalist.title"),
            subtitle: t("slides.minimalist.subtitle"),
            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2670&auto=format&fit=crop",
            link: "/products?category=decor"
        },
        {
            id: 2,
            title: t("slides.gentleman.title"),
            subtitle: t("slides.gentleman.subtitle"),
            image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=2574&auto=format&fit=crop",
            link: "/products?category=clothing"
        },
        {
            id: 3,
            title: t("slides.tech.title"),
            subtitle: t("slides.tech.subtitle"),
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2701&auto=format&fit=crop",
            link: "/products?category=electronics"
        },
        {
            id: 4,
            title: t("slides.lens.title"),
            subtitle: t("slides.lens.subtitle"),
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2564&auto=format&fit=crop",
            link: "/products?category=electronics"
        }
    ], [t]);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            sx={{
                position: "relative",
                maxWidth: "1800px",
                mx: "auto",
                px: { xs: 0, md: 4 },
                mt: { xs: 4, md: 8 },
                mb: { xs: 8, md: 12 },
            }}
        >
            <Box
                sx={{
                    borderRadius: { xs: 0, md: "32px" },
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: theme.palette.mode === 'dark'
                        ? "0 20px 80px rgba(0,0,0,0.5)"
                        : "0 20px 80px rgba(0,0,0,0.15)",
                    height: { xs: "500px", md: "600px" },
                }}
            >
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade, Parallax]}
                    speed={1000}
                    parallax={true}
                    navigation
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        renderBullet: function (index, className) {
                            return '<span class="' + className + '"></span>';
                        }
                    }}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    loop
                    style={{ height: "100%" }}
                    className="hero-slider"
                >
                    {SLIDER_DATA.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    bgcolor: "black"
                                }}
                            >
                                <Box
                                    data-swiper-parallax="50%"
                                    data-swiper-parallax-scale="1.1"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundImage: `url(${slide.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        zIndex: 0,
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background: `linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)`,
                                        }
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "relative",
                                        zIndex: 2,
                                        pl: { xs: 4, md: 12 },
                                        pr: { xs: 4, md: 0 },
                                        maxWidth: "800px",
                                        color: "white"
                                    }}
                                >
                                    <Typography
                                        data-swiper-parallax="-300"
                                        variant="subtitle1"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 700,
                                            letterSpacing: "4px",
                                            textTransform: "uppercase",
                                            color: theme.palette.secondary.main,
                                            textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                                        }}
                                    >
                                        {slide.subtitle}
                                    </Typography>
                                    <Typography
                                        data-swiper-parallax="-200"
                                        variant="h1"
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: { xs: "2.5rem", md: "5rem" },
                                            lineHeight: 1,
                                            mb: 4,
                                            letterSpacing: "-2px",
                                            textShadow: "0 10px 30px rgba(0,0,0,0.5)"
                                        }}
                                    >
                                        {slide.title}
                                    </Typography>

                                    <Button
                                        data-swiper-parallax="-100"
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate(slide.link)}
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            bgcolor: "white",
                                            color: "black",
                                            borderRadius: "50px",
                                            px: 5,
                                            py: 1.5,
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            "&:hover": {
                                                bgcolor: theme.palette.secondary.main,
                                                color: "white",
                                                transform: "translateY(-2px)"
                                            }
                                        }}
                                    >
                                        {t("common.discoverNow")}
                                    </Button>
                                </Box>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            <style>
                {`
                    .hero-slider .swiper-pagination-bullet {
                        width: 12px;
                        height: 12px;
                        background: rgba(255,255,255,0.5);
                        opacity: 1;
                        transition: all 0.3s ease;
                    }
                    .hero-slider .swiper-pagination-bullet-active {
                        width: 40px;
                        border-radius: 6px;
                        background: ${theme.palette.secondary.main};
                    }
                    .hero-slider .swiper-button-next,
                    .hero-slider .swiper-button-prev {
                        color: white;
                        width: 60px;
                        height: 60px;
                        background: rgba(255,255,255,0.1);
                        backdrop-filter: blur(10px);
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    }
                    .hero-slider .swiper-button-next:after,
                    .hero-slider .swiper-button-prev:after {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .hero-slider .swiper-button-next:hover,
                    .hero-slider .swiper-button-prev:hover {
                        background: white;
                        color: black;
                        transform: scale(1.1);
                    }
                `}
            </style>
        </Box>
    );
});
