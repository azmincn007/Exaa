import React from 'react';
import {
  FormControl,
  FormLabel,
  Checkbox,
  Box,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

const YearFilter = ({ filterValues, handleFilterChange }) => {
  const endYear = new Date().getFullYear() + 1; // Current year + 1
  const startYear = 2000;
  const vehicleYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );

  const handleYearToggle = (year) => {
    const updatedYears = filterValues.year ? [...filterValues.year] : [];
    if (updatedYears.includes(year)) {
      updatedYears.splice(updatedYears.indexOf(year), 1);
    } else {
      updatedYears.push(year);
    }
    handleFilterChange('year', updatedYears);
  };

  return (
    <FormControl>
      <FormLabel>Year of Manufacture (2000-{endYear})</FormLabel>
      {/* Scrollable box for checkboxes only */}
      <Box maxHeight="200px" overflowY="auto">
        <Wrap spacing={2}>
          {vehicleYears.map((year) => (
            <WrapItem key={year}>
              <Checkbox
                isChecked={filterValues.year?.includes(year) || false}
                onChange={() => handleYearToggle(year)}
              >
                {year}
              </Checkbox>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </FormControl>
  );
};

export default YearFilter;
