// src/components/Filters/FiltersSingle/BathroomFilter.js
import React from 'react';
import {
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const BathroomFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['1', '2', '3', '4', '4+'];

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Bathrooms</FormLabel>
      <CheckboxGroup
        value={filterValues.bathrooms || []}
        onChange={(values) => handleFilterChange('bathrooms', values)}
      >
        <SimpleGrid columns={2} spacing={2}>
          {options.map((option) => (
            <Checkbox key={option} value={option}>
              {option}
            </Checkbox>
          ))}
        </SimpleGrid>
      </CheckboxGroup>
    </FormControl>
  );
};

export default BathroomFilter;
