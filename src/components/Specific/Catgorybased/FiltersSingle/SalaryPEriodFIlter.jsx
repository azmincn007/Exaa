import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const SalaryPeriodFilter = ({ filterValues, handleFilterChange }) => {
  const options = ['Hourly', 'Daily Wages', 'Monthly', 'Weekly', 'Yearly'];

  const handleCheckboxChange = (value) => {
    const updatedValues = filterValues.salaryPeriod ? [...filterValues.salaryPeriod] : [];
    if (updatedValues.includes(value)) {
      updatedValues.splice(updatedValues.indexOf(value), 1);
    } else {
      updatedValues.push(value);
    }
    handleFilterChange('salaryPeriod', updatedValues);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Salary Period</FormLabel>
      <Stack maxH="200px" spacing={2}>
        {options.map((option) => (
          <Checkbox
            key={option}
            isChecked={filterValues.salaryPeriod?.includes(option) || false}
            onChange={() => handleCheckboxChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default SalaryPeriodFilter;