// TotalFloorsFilter.js
import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const TotalFloorsFilter = ({ filterValues, handleFilterChange }) => {
  const floorOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  const handleCheckboxChange = (floor) => {
    const updatedFloors = filterValues.totalFloors ? [...filterValues.totalFloors] : [];
    if (updatedFloors.includes(floor)) {
      updatedFloors.splice(updatedFloors.indexOf(floor), 1);
    } else {
      updatedFloors.push(floor);
    }
    handleFilterChange('totalFloors', updatedFloors);
  };

  return (
    <FormControl>
      <FormLabel>Total Floors</FormLabel>
      <Stack maxH="200px" overflowY="auto" spacing={2}>
        {floorOptions.map((floor) => (
          <Checkbox
            key={floor}
            isChecked={filterValues.totalFloors?.includes(floor) || false}
            onChange={() => handleCheckboxChange(floor)}
          >
            {floor}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
}; 
  export default  TotalFloorsFilter