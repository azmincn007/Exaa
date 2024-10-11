import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const ExperienceFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['Freshers', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];

  const handleCheckboxChange = (value) => {
    const updatedValues = filterValues.experience ? [...filterValues.experience] : [];
    if (updatedValues.includes(value)) {
      updatedValues.splice(updatedValues.indexOf(value), 1);
    } else {
      updatedValues.push(value);
    }
    handleFilterChange('experience', updatedValues);
  };

  return (
    <FormControl>
      <FormLabel>Experience</FormLabel>
      <Stack maxH="200px" spacing={2}>
        {options.map((option) => (
          <Checkbox
            key={option}
            isChecked={filterValues.experience?.includes(option) || false}
            onChange={() => handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default ExperienceFilter;