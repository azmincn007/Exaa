import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const QualificationFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['No Qualification needed', 'SSLC', 'Plus Two', 'Any Degree', 'Post Graduation', 'Professional Qualification'];

  const handleCheckboxChange = (value) => {
    const updatedValues = filterValues.qualification ? [...filterValues.qualification] : [];
    if (updatedValues.includes(value)) {
      updatedValues.splice(updatedValues.indexOf(value), 1);
    } else {
      updatedValues.push(value);
    }
    handleFilterChange('qualification', updatedValues);
  };

  return (
    <FormControl>
      <FormLabel>Qualification</FormLabel>
      <Stack maxH="200px" spacing={2}>
        {options.map((option) => (
          <Checkbox
            key={option}
            isChecked={filterValues.qualification?.includes(option) || false}
            onChange={() => handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default QualificationFilter;