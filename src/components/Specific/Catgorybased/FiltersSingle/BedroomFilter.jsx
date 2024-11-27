// src/components/Filters/FiltersSingle/BedroomFilter.js
import React from 'react';
import {
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const BedroomFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['Studio+', '1', '2', '3', '4', '4+'];

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Bedrooms</FormLabel>
      <CheckboxGroup
        value={filterValues.bedrooms || []}
        onChange={(values) => handleFilterChange('bedrooms', values)}
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

export default BedroomFilter;
