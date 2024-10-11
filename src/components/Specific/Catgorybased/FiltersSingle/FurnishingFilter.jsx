// src/components/Filters/FiltersSingle/FurnishingFilter.js
import React from 'react';
import {
  VStack,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const FurnishingFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['Furnished', 'Semi Furnished', 'Unfurnished'];

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Furnishing</FormLabel>
      <CheckboxGroup
        value={filterValues.furnishing || []}
        onChange={(values) => handleFilterChange('furnishing', values)}
      >
        <VStack align="start" spacing={2}>
          {options.map((option) => (
            <Checkbox key={option} value={option}>
              {option}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </FormControl>
  );
};

export default FurnishingFilter;