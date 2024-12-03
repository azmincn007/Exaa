import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOMetaTags = ({ 
  title = "Exxaa - Your Platform", 
  description = "Discover, Connect, Trade", 
  imageUrl = "/default-og-image.jpg" 
}) => {
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${imageUrl}`} />
      <meta property="og:image:secure_url" content={`${siteUrl}${imageUrl}`} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${imageUrl}`} />

      {/* WhatsApp */}
      <meta property="og:site_name" content="Exxaa" />
    </Helmet>
  );
};

export default SEOMetaTags;