import React from "react";
import { Helmet } from "react-helmet";

interface PageMetaProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    canonicalUrl?: string;
}

export default function PageMeta({
    title,
    description = "Premium E-Commerce Platform - Discover the best products at amazing prices. Shop now for electronics, fashion, home & more.",
    keywords = "ecommerce, online shopping, products, electronics, fashion, home, deals, discounts, premium",
    image = "https://ecommerce.routemisr.com/Route-Academy-brands/1678285758109.png",
    url,
    type = "website",
    author = "E-COMMERCE",
    canonicalUrl
}: PageMetaProps) {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const canonical = canonicalUrl || currentUrl;
    const fullTitle = `${title} | E-COMMERCE`;
    const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:site_name" content="E-COMMERCE" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:creator" content="@ecommerce" />

            {/* Additional SEO */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="E-COMMERCE" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "E-COMMERCE",
                    "url": siteUrl,
                    "description": description,
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": `${siteUrl}/products?keyword={search_term_string}`
                        },
                        "query-input": "required name=search_term_string"
                    }
                })}
            </script>
        </Helmet>
    );
}
