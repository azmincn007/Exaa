import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const FacingFilter = ({ filterValues, handleFilterChange }) => {
  const facingOptions = [
    'East',
    'North',
    'South',
    'West',
    'North-East',
    'North-West',
    'South-East',
    'South-West'
  ];

  const handleCheckboxChange = (facing) => {
    const updatedFacing = filterValues.facing ? [...filterValues.facing] : [];
    if (updatedFacing.includes(facing)) {
      updatedFacing.splice(updatedFacing.indexOf(facing), 1);
    } else {
      updatedFacing.push(facing);
    }
    handleFilterChange('facing', updatedFacing);
  };

  return (
    <FormControl>
      <FormLabel>Facing</FormLabel>
      <Stack maxH="200px" spacing={2}>
        {facingOptions.map((facing) => (
          <Checkbox
            key={facing}
            isChecked={filterValues.facing?.includes(facing) || false}
            onChange={() => handleCheckboxChange(facing)}
          >
            {facing}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default FacingFilter