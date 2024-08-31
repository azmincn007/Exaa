import React, { useState, useEffect } from 'react';
import Navbar from '../components/feutures/Navbar';
import CatetogoryTab from '../components/feutures/CatetogoryTab';
import Landing from './SpecificPages/Landing';
import Footer from '../components/feutures/Footer';
import PackagesAndOrders from './SpecificPages/PackagesandOrders';
import LocationModal from '../components/modals/othermodals/LocationModal';

function Home() {
  const [showPackagesAndOrders, setShowPackagesAndOrders] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    // Open the LocationModal when the component mounts
    setIsLocationModalOpen(true);
  }, []);

  const handleShowPackagesAndOrders = () => {
    setShowPackagesAndOrders(true);
  };

  const handleCloseLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <div>
      <Navbar onShowPackagesAndOrders={handleShowPackagesAndOrders} />
      <CatetogoryTab />
      {showPackagesAndOrders ? <PackagesAndOrders /> : <Landing />}
      <Footer />
      <LocationModal isOpen={isLocationModalOpen} onClose={handleCloseLocationModal} />
    </div>
  );
}

export default Home;