import React, { useState, useEffect } from 'react';
import Landing from './SpecificPages/Landing';
import PackagesAndOrders from './SpecificPages/PackagesandOrders';
import LocationModal from '../components/modals/othermodals/LocationModal';
import Layout from './Layout';

function Home() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const token = localStorage.getItem('UserToken');
  console.log(token);
  

  // Open the LocationModal when the component mounts if any of the IDs is null
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
        <Landing />

      <LocationModal isOpen={isLocationModalOpen} onClose={handleLocationModalClose} />
    </>
  );
}

export default Home;