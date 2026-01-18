import imge2 from "../assets/images/banner-4.jpeg";
import imge3 from "../assets/images/charlesdeluvio-FK81rxilUXg-unsplash.jpg";
import imge4 from "../assets/images/clark-street-mercantile-P3pI6xzovu0-unsplash.jpg";
import imge5 from "../assets/images/slider-image-1.jpeg";
import imge6 from "../assets/images/slider-image-2.jpeg";
import imge7 from "../assets/images/slider-image-3.jpeg";
import imge8 from "../assets/images/visa.jpg";
import imge9 from "../assets/images/asd.jpg";

export interface SliderImage {
    src: string;
    title: string;
    subtitle: string;
    buttonText: string;
}

export interface SideImageData {
    src: string;
    label: string;
    sub: string;
}

export const sliderImages: SliderImage[] = [
    {
        src: imge2,
        title: "Next-Gen Tech",
        subtitle: "Experience the future of electronics today.",
        buttonText: "Shop Tech",
    },
    {
        src: imge3,
        title: "Style Redefined",
        subtitle: "Premium collections for the modern wardrobe.",
        buttonText: "Explore Fashion",
    },
    {
        src: imge4,
        title: "Modern Living",
        subtitle: "Curated essentials for your contemporary home.",
        buttonText: "Browse Home",
    },
    {
        src: imge5,
        title: "Elegance Flow",
        subtitle: "Timeless fashion pieces for every occasion.",
        buttonText: "View Collection",
    },
    {
        src: imge6,
        title: "Urban Pulse",
        subtitle: "Streetwear that matches your city's energy.",
        buttonText: "Get Styled",
    },
    {
        src: imge7,
        title: "Summer Peak",
        subtitle: "Gear up for the most vibrant season yet.",
        buttonText: "Shop Summer",
    },
];

export const sideImagesData: SideImageData[] = [
    { src: imge8, label: "Digital Wallets", sub: "Secure payments & rewards" },
    { src: imge9, label: "Global Shipping", sub: "Fast delivery worldwide" },
];
