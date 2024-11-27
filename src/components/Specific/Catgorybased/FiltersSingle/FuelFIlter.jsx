// src/components/Filters/FiltersSingle/FuelFilter.js
import React from 'react';
import { FormControl, FormLabel, Checkbox, SimpleGrid } from '@chakra-ui/react';

const FuelFilter = ({ filterValues, handleFilterChange }) => {
  const fuelOptions = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];

  const handleCheckboxChange = (fuel) => {
    const updatedFuels = filterValues.fuel ? [...filterValues.fuel] : [];
    if (updatedFuels.includes(fuel)) {
      updatedFuels.splice(updatedFuels.indexOf(fuel), 1);
    } else {
      updatedFuels.push(fuel);
    }
    handleFilterChange('fuel', updatedFuels);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Fuel Type</FormLabel>
      <SimpleGrid columns={2} spacing={2}>
        {fuelOptions.map((fuel) => (
          <Checkbox
            key={fuel}
            isChecked={filterValues.fuel?.includes(fuel) || false}
            onChange={() => handleCheckboxChange(fuel)}
          >
            {fuel}
          </Checkbox>
        ))}
      </SimpleGrid>
    </FormControl>
  );
};

export default FuelFilter;
