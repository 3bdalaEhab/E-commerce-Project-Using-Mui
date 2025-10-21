import React from "react";
import { Helmet } from "react-helmet";

export default function PageMeta({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description || ""} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}
