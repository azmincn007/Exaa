// src/components/Filters/FiltersSingle/FloorNoFilter.js
import React from 'react';
import { FormControl, FormLabel, Checkbox, SimpleGrid } from '@chakra-ui/react';

const FloorNoFilter = ({ filterValues, handleFilterChange }) => {
  const floorOptions = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '20+'
  ];

  const handleCheckboxChange = (floor) => {
    const updatedFloors = filterValues.floorNo ? [...filterValues.floorNo] : [];
    if (updatedFloors.includes(floor)) {
      updatedFloors.splice(updatedFloors.indexOf(floor), 1);
    } else {
      updatedFloors.push(floor);
    }
    handleFilterChange('floorNo', updatedFloors);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Floor Number</FormLabel>
      <SimpleGrid columns={2} spacing={2} maxH="200px" overflowY="auto">
        {floorOptions.map((floor) => (
          <Checkbox
            key={floor}
            isChecked={filterValues.floorNo?.includes(floor) || false}
            onChange={() => handleCheckboxChange(floor)}
          >
            {floor}
          </Checkbox>
        ))}
      </SimpleGrid>
    </FormControl>
  );
};

export default FloorNoFilter;
