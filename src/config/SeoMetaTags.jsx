import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOMetaTags = ({
  title = "Exxaa - Your Platform",
  description = "Discover, Connect, Trade",
  url = '',
  image = ''
}) => {
  // Use the fixed domain
  const siteUrl = url || 'https://exaaa.netlify.app/';

  // Ensure title is descriptive and doesn't include the domain
  const formattedTitle = title.includes('exaaa.netlify.app') 
    ? 'Exxaa - Your Platform for Buying and Selling' 
    : title;

  // Use a default image if no image is provided
  const ogImage = image || 'https://exaaa.netlify.app/default-og-image.jpg';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* WhatsApp */}
      <meta property="og:site_name" content="Exxaa" />
    </Helmet>
  );
};

export default SEOMetaTags;