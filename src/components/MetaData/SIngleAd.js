import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const SingleAd = () => {
  const location = useLocation();
  // Get the query parameters
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('categoryId');
  const adId = queryParams.get('adId');
  const subCategoryId = queryParams.get('subCategoryId');

  // Static product details for testing
  const product = {
    id: adId, // still keeping the adId for potential future use
    title: "Sample Product Title", // Static title
    description: "This is a static description for the product. It provides an overview of the product details.", // Static description
    image: '/path/to/sample-product.jpg', // Static image path
  };

  return (
    <div>
      <Helmet>
        <title>{product.title} - Exxaa</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.title} - Exxaa`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
      </Helmet>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* Product details */}
      <img src={product.image} alt={product.title} />
    </div>
  );
};

export default SingleAd;