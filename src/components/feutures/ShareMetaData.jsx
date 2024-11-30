import React from 'react';
import { BASE_URL } from '../../config/config';
import { Helmet } from 'react-helmet-async';

const ShareMetadata = ({ adData, onWhatsAppShare }) => {
  const title = adData.title || 'Ad Title';
  const description = adData.description || 'Check out this ad';
  const imageUrl = adData.images && adData.images.length > 0 
    ? `${BASE_URL}${adData.images[0].url}` 
    : `${BASE_URL}/default-image.jpg`;  // Provide a default image
  const url = window.location.href;

  return (
    <>
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Your Marketplace" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

     
    </>
  );
};

export default ShareMetadata;