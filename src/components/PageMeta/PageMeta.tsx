import React from "react";
import { Helmet } from "react-helmet";

interface PageMetaProps {
    title: string;
    description?: string;
}

export default function PageMeta({ title, description }: PageMetaProps) {
    return (
        <Helmet>
            <title>{`${title} | E-COMMERCE`}</title>
            <meta name="description" content={description || "Premium E-Commerce Platform"} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>
    );
}
