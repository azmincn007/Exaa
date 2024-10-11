// src/components/Filters/FiltersSingle/ListedByFilter.js
import React from 'react';
import {
  VStack,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const ListedByFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['Owner', 'Builder', 'Dealer', 'Broker'];

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Listed By</FormLabel>
      <CheckboxGroup
        value={filterValues.listedBy || []}
        onChange={(values) => handleFilterChange('listedBy', values)}
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

export default ListedByFilter;