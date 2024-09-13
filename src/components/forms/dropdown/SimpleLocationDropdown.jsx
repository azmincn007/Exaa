// SimpleCountryDropdown.jsx
import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { FaChevronDown } from "react-icons/fa";
import LocationModal from '../../modals/othermodals/LocationModal';

const SimpleCountryDropdown = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');

  useEffect(() => {
    const storedTownName = localStorage.getItem('selectedTownName');
    if (storedTownName) {
      setSelectedLocation(storedTownName);
    }
  }, []);

  const handleToggle = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    const storedTownName = localStorage.getItem('selectedTownName');
    if (storedTownName) {
      setSelectedLocation(storedTownName);
    }
  };

  return (
    <Box position="relative">
      <Box
        display="flex"
        alignItems="center"
        cursor="pointer"
        onClick={handleToggle}
      >
        <Text mr={2}>{selectedLocation}</Text>
        <FaChevronDown />
      </Box>
      <LocationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLocationSet={handleCloseModal}
      />
    </Box>
  );
};

export default SimpleCountryDropdown;