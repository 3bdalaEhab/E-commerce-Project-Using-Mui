import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Image imports
import imge2 from "../../assets/images/banner-4.jpeg";
import imge3 from "../../assets/images/charlesdeluvio-FK81rxilUXg-unsplash.jpg";
import imge4 from "../../assets/images/clark-street-mercantile-P3pI6xzovu0-unsplash.jpg";
import imge5 from "../../assets/images/slider-image-1.jpeg";
import imge6 from "../../assets/images/slider-image-2.jpeg";
import imge7 from "../../assets/images/slider-image-3.jpeg";
import imge8 from "../../assets/images/visa.jpg";
import imge9 from "../../assets/images/asd.jpg";

export default function CategoriesSlider() {
  const theme = useTheme();
  const allImages = [
    { src: imge2, title: "Next-Gen Tech", subtitle: "Experience the future of electronics today.", buttonText: "Shop Tech" },
    { src: imge3, title: "Style Redefined", subtitle: "Premium collections for the modern wardrobe.", buttonText: "Explore Fashion" },
    { src: imge4, title: "Modern Living", subtitle: "Curated essentials for your contemporary home.", buttonText: "Browse Home" },
    { src: imge5, title: "Elegance Flow", subtitle: "Timeless fashion pieces for every occasion.", buttonText: "View Collection" },
    { src: imge6, title: "Urban Pulse", subtitle: "Streetwear that matches your city's energy.", buttonText: "Get Styled" },
    { src: imge7, title: "Summer Peak", subtitle: "Gear up for the most vibrant season yet.", buttonText: "Shop Summer" },
  ];

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
          "&:hover": { bgcolor: theme.palette.primary.main, transform: "scale(1.1)" },
          opacity: 0,
        },
        "&:hover .swiper-button-next, &:hover .swiper-button-prev": { opacity: 1 },
        "& .swiper-pagination-bullet": { bgcolor: "#fff", opacity: 0.5, width: "10px", height: "10px" },
        "& .swiper-pagination-bullet-active": { bgcolor: theme.palette.primary.main, opacity: 1, width: "24px", borderRadius: "5px" },
      }}
    >
      {/* Main Slider Area */}
      <Box
        sx={{
          flex: 3,
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
          boxShadow: theme.palette.mode === 'dark'
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
          {allImages.map((img, index) => (
            <SwiperSlide key={index}>
              <Box sx={{ position: "relative", height: { xs: "350px", md: "520px" }, overflow: "hidden" }}>
                <Box
                  component="img"
                  src={img.src}
                  alt={img.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 8s ease",
                  }}
                />

                {/* Visual Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: { xs: 4, md: 10 },
                    color: "#fff",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        letterSpacing: "4px", fontWeight: "800", color: theme.palette.primary.light,
                        mb: 1, display: "block"
                      }}
                    >
                      Premium Collection
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: "900",
                        mb: 2,
                        fontSize: { xs: "2.4rem", md: "4rem" },
                        lineHeight: 1.1,
                        letterSpacing: "-2px"
                      }}
                    >
                      {img.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.3rem" },
                        color: "rgba(255,255,255,0.8)",
                        maxWidth: "500px",
                        mb: 4,
                        fontWeight: "400"
                      }}
                    >
                      {img.subtitle}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: "50px",
                        px: 5,
                        py: 1.8,
                        fontWeight: "800",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        "&:hover": { transform: "translateY(-3px)", boxShadow: theme.shadows[10] }
                      }}
                    >
                      {img.buttonText}
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Side Images Area */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: 1,
          flexDirection: "column",
          gap: 3,
        }}
      >
        {[
          { src: imge8, label: "Digital Wallets", sub: "Secure payments & rewards" },
          { src: imge9, label: "Global Shipping", sub: "Fast delivery worldwide" }
        ].map((side, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
            whileHover={{ scale: 1.02 }}
            sx={{
              flex: 1,
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: theme.palette.mode === 'dark'
                ? "0 10px 30px rgba(0,0,0,0.3)"
                : "0 10px 30px rgba(0,0,0,0.06)",
              "&:hover img": { transform: "scale(1.1)" },
              "&:hover .side-overlay": { bgcolor: "rgba(0,0,0,0.5)" }
            }}
          >
            <Box
              component="img"
              src={side.src}
              alt={side.label}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "24px",
                objectFit: "cover",
                transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            <Box
              className="side-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                p: 3,
                transition: "background-color 0.3s ease",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: "900", lineHeight: 1 }}>
                {side.label}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}>
                {side.sub}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
