// src/components/Filters/FiltersSingle/ListedByFilter.js
import React from 'react';
import {
  SimpleGrid,
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

export default ListedByFilter;
