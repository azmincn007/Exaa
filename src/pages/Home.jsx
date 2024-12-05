import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Landing from './SpecificPages/Landing';
import LocationModal from '../components/modals/othermodals/LocationModal';
import { useAuth } from '../Hooks/AuthContext';

function Home() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const { getToken, isLoggedIn } = useAuth();
  const token = getToken();

  useEffect(() => {
    const selectedTownId = localStorage.getItem('selectedTownId');
    const selectedDistrictId = localStorage.getItem('selectedDistrictId');

    // Check if either selectedTownId or selectedDistrictId is null
    if (selectedTownId === null || selectedDistrictId === null) {
      setIsLocationModalOpen(true);
    } else {
      setIsLocationModalOpen(false);
    }
  }, []);

  const handleLocationModalClose = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Home | Your Marketplace Name</title>
        <meta 
          name="description" 
          content="Discover local marketplace for buying and selling items. Find great deals, connect with sellers, and explore a wide range of products in your area." 
        />
        
        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content="Home | Your Marketplace Name" />
        <meta 
          property="og:description" 
          content="Discover local marketplace for buying and selling items. Find great deals, connect with sellers, and explore a wide range of products in your area." 
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <Landing />
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={handleLocationModalClose} 
      />
    </>
  );
}

export default Home;