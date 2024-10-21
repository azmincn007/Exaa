// src/components/Filters/FiltersSingle/CarParkingFilter.js
import React from 'react';
import { FormControl, FormLabel, Checkbox, SimpleGrid } from '@chakra-ui/react';

const CarParkingFilter = ({ filterValues, handleFilterChange }) => {
  const parkingOptions = ['Any', '1', '2', '3', '4+'];

  const handleCheckboxChange = (option) => {
    const updatedParking = filterValues.carParking ? [...filterValues.carParking] : [];
    if (updatedParking.includes(option)) {
      updatedParking.splice(updatedParking.indexOf(option), 1);
    } else {
      if (option === 'Any') {
        updatedParking.length = 0; // Clear all other selections
      } else {
        const anyIndex = updatedParking.indexOf('Any');
        if (anyIndex > -1) {
          updatedParking.splice(anyIndex, 1); // Remove 'Any' if a specific number is selected
        }
      }
      updatedParking.push(option);
    }
    handleFilterChange('carParking', updatedParking);
  };

  return (
    <FormControl>
      <FormLabel>Car Parking</FormLabel>
      <SimpleGrid columns={2} spacing={2}>
        {parkingOptions.map((option) => (
          <Checkbox
            key={option}
            isChecked={filterValues.carParking?.includes(option) || false}
            onChange={() => handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </SimpleGrid>
    </FormControl>
  );
};

export default CarParkingFilter;
