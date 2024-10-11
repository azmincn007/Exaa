// src/components/Filters/FiltersSingle/ConstructionStatusFilter.js
import React from 'react';
import {
  VStack,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const ConstructionStatusFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['New Launch', 'Ready to Move', 'Under Construction'];

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Construction Status</FormLabel>
      <CheckboxGroup
        value={filterValues.constructionStatus || []}
        onChange={(values) => handleFilterChange('constructionStatus', values)}
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

export default ConstructionStatusFilter;