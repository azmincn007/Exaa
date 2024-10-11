import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

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
      <FormLabel>Fuel Type</FormLabel>
      <Stack maxH="200px" spacing={2}>
        {fuelOptions.map((fuel) => (
          <Checkbox
            key={fuel}
            isChecked={filterValues.fuel?.includes(fuel) || false}
            onChange={() => handleCheckboxChange(fuel)}
          >
            {fuel}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default FuelFilter;