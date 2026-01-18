import React from "react";
import { Helmet } from "react-helmet";

interface PageMetaProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export default function PageMeta({
    title,
    description = "Premium E-Commerce Platform",
    image = "https://ecommerce.routemisr.com/Route-Academy-brands/1678285758109.png", // Default image
    url = window.location.href,
    type = "website"
}: PageMetaProps) {
    const fullTitle = `${title} | E-COMMERCE`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
}
