import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../../config/config';

const ShareMetadata = ({ adData }) => {
  useEffect(() => {
    // Update page title
    document.title = adData?.title || 'Ad Details';
  }, [adData?.title]);

  // If no ad data, return null
  if (!adData) return null;

  // Determine the first image URL or use a default
  const imageUrl = adData.images && adData.images.length > 0
    ? `${BASE_URL}${adData.images[0].url}`
    : '/default-ad-image.jpg';

  // Create a clean description
  const description = adData.description
    ? adData.description.substring(0, 200) + '...'
    : 'Check out this amazing ad!';

  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={adData.title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={adData.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* WhatsApp Card */}
      <meta property="og:site_name" content="Your Site Name" />
      <meta name="twitter:site" content="@yourTwitterHandle" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:creator" content="@yourTwitterHandle" />
      
      {/* Additional WhatsApp-specific meta tags */}
      <meta property="og:app_id" content="your_facebook_app_id" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="article" />
    </Helmet>
  );
};

export default ShareMetadata;