import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const PositionTypeFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['Contract', 'Full Time', 'Part Time', 'Trainee'];

  const handleCheckboxChange = (value) => {
    const updatedValues = filterValues.positionType ? [...filterValues.positionType] : [];
    if (updatedValues.includes(value)) {
      updatedValues.splice(updatedValues.indexOf(value), 1);
    } else {
      updatedValues.push(value);
    }
    handleFilterChange('positionType', updatedValues);
  };

  return (
    <FormControl>
      <FormLabel>Position Type</FormLabel>
      <Stack maxH="200px" spacing={2}>
        {options.map((option) => (
          <Checkbox
            key={option}
            isChecked={filterValues.positionType?.includes(option) || false}
            onChange={() => handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default PositionTypeFilter;