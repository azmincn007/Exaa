import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEOMetaTags = ({
  title = "Exxaa - Your Platform",
  description = "Discover, Connect, Trade",
  url = '' // Allow passing a specific URL
}) => {
  // Attempt to get URL from window, fallback to passed URL or empty string
  const siteUrl = (typeof window !== 'undefined' && window.location.origin) 
    || url 
    || '';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* WhatsApp */}
      <meta property="og:site_name" content="Exxaa" />
    </Helmet>
  )
}

export default SEOMetaTags