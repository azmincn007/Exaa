// src/components/Filters/FiltersSingle/FacingFilter.js
import React from 'react';
import { FormControl, FormLabel, Checkbox, SimpleGrid } from '@chakra-ui/react';

const FacingFilter = ({ filterValues, handleFilterChange }) => {
  const facingOptions = [
    'East',
    'North',
    'South',
    'West',
    'North-East',
    'North-West',
    'South-East',
    'South-West'
  ];

  const handleCheckboxChange = (facing) => {
    const updatedFacing = filterValues.facing ? [...filterValues.facing] : [];
    if (updatedFacing.includes(facing)) {
      updatedFacing.splice(updatedFacing.indexOf(facing), 1);
    } else {
      updatedFacing.push(facing);
    }
    handleFilterChange('facing', updatedFacing);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Facing</FormLabel>
      <SimpleGrid columns={2} maxH="200px" overflowY="auto" spacing={2}>
        {facingOptions.map((facing) => (
          <Checkbox
            key={facing}
            isChecked={filterValues.facing?.includes(facing) || false}
            onChange={() => handleCheckboxChange(facing)}
          >
            {facing}
          </Checkbox>
        ))}
      </SimpleGrid>
    </FormControl>
  );
};

export default FacingFilter;
