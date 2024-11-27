import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack, Box } from '@chakra-ui/react';
import { vehicleData } from '../../../../Data/VehicleData';

const RTOCodeFilter = ({ filterValues, handleFilterChange }) => {
  const handleCheckboxChange = (rtoCode) => {
    const updatedRTOCodes = filterValues.rtoCodes ? [...filterValues.rtoCodes] : [];
    if (updatedRTOCodes.includes(rtoCode)) {
      updatedRTOCodes.splice(updatedRTOCodes.indexOf(rtoCode), 1);
    } else {
      updatedRTOCodes.push(rtoCode);
    }
    handleFilterChange('rtoCodes', updatedRTOCodes);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">RTO Code</FormLabel>
      <Box maxH="200px" overflowY="auto">
        <Stack spacing={2}>
          {vehicleData.rtoCodes.map((option) => (
            <Checkbox
              key={option.name}
              isChecked={filterValues.rtoCodes?.includes(option.name) || false}
              onChange={() => handleCheckboxChange(option.name)}
            >
              {option.name}
            </Checkbox>
          ))}
        </Stack>
      </Box>
    </FormControl>
  );
};

export default RTOCodeFilter;