// src/components/Filters/FiltersSingle/FuelFilter.js
import React from 'react';
import { FormControl, FormLabel, Checkbox, SimpleGrid, Text } from '@chakra-ui/react';

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
      <Text className="font-semibold mb-2">Fuel Type</Text>
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
