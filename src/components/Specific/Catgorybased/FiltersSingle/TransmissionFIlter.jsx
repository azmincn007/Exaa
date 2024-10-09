import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const TransmissionFilter = ({ filterValues, handleFilterChange }) => {
  const transmissionOptions = ["Manual", "Automatic"];

  const handleCheckboxChange = (transmission) => {
    const updatedTransmissions = filterValues.transmission ? [...filterValues.transmission] : [];
    if (updatedTransmissions.includes(transmission)) {
      updatedTransmissions.splice(updatedTransmissions.indexOf(transmission), 1);
    } else {
      updatedTransmissions.push(transmission);
    }
    handleFilterChange('transmission', updatedTransmissions);
  };

  return (
    <FormControl>
      <FormLabel>Transmission</FormLabel>
      <Stack spacing={2}>
        {transmissionOptions.map((transmission) => (
          <Checkbox
            key={transmission}
            isChecked={filterValues.transmission?.includes(transmission) || false}
            onChange={() => handleCheckboxChange(transmission)}
          >
            {transmission}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default TransmissionFilter;