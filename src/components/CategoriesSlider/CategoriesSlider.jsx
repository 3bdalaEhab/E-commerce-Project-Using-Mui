import React from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// ✅ بدل ما نستورد كل صورة لوحدها ممكن بعدين نخليهم في مجلد واحد ونعمل loop
import imge2 from "../../assets/images/banner-4.jpeg";
import imge3 from "../../assets/images/charlesdeluvio-FK81rxilUXg-unsplash.jpg";
import imge4 from "../../assets/images/clark-street-mercantile-P3pI6xzovu0-unsplash.jpg";
import imge5 from "../../assets/images/slider-image-1.jpeg";
import imge6 from "../../assets/images/slider-image-2.jpeg";
import imge7 from "../../assets/images/slider-image-3.jpeg";
import imge8 from "../../assets/images/visa.jpg";
import imge9 from "../../assets/images/asd.jpg";

export default function CategoriesSlider() {
  const allImages = [
    {
      src: imge2,
      title: "New Arrivals",
      subtitle: "Discover our latest collection",
    },
    {
      src: imge3,
      title: "Exclusive Offers",
      subtitle: "Save up to 50% this week",
    },
    {
      src: imge4,
      title: "Men's Fashion",
      subtitle: "Trendy styles for every occasion",
    },
    {
      src: imge5,
      title: "Women's Collection",
      subtitle: "Elegant. Chic. Modern.",
    },
    {
      src: imge6,
      title: "Accessories",
      subtitle: "Complete your look with class",
    },
    { src: imge7, title: "Summer Sale", subtitle: "Hot deals just for you!" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "stretch",
        mt: { xs: 3, md: 5 },
        flexWrap: { xs: "wrap", md: "nowrap" },
        mx: "20px",
      }}
    >
      {/* 🎠 السلايدر الرئيسي */}
      <Box
        sx={{
          flex: 3,
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          cursor:"grabbing",
          
          
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          effect="fade"
        >
          {allImages.map((img, index) => (
            <SwiperSlide key={index}>
              <Box sx={{ position: "relative" }}>
                <motion.img
                  src={img.src}
                  alt={`slide-${index}`}
                  style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "16px",
                    cursor: "grab",
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                />

                {/* 📝 النص فوق الصورة */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "#fff",
                    background:
                      "linear-gradient(180deg, rgba(33, 248, 158, 0.13), rgba(3, 150, 235, 0.1))",
                    px: 2,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: { xs: "1.6rem", md: "2.2rem" },
                      }}
                    >
                      {img.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                        color: "#f0f0f0",
                      }}
                    >
                      {img.subtitle}
                    </Typography>
                  </motion.div>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* 🖼️ الصور الجانبية */}
    <Box
      sx={{
        my: "1px",
        display: { xs: "none", md: "flex" },
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {[imge8,imge9].map((sideImg, i) => (
        <motion.img
          key={i}
          src={sideImg}
          alt={`side-${i}`}
          style={{
            width: "100%",
            height: "210px",
            borderRadius: "16px",
            objectFit: "cover",
            cursor:"pointer"
          }}
          // ===== Animation settings =====
          initial={{ x: 200, opacity: 0 }}        
          animate={{ x: 0, opacity: 1 }}          
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: i * 0.3,                      
          }}
          whileHover={{ scale: 1.05 }}            
        />
      ))}
    </Box>
    </Box>
  );
}
