import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const MonthlyRentRangeFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 100;
  const MAX_VALUE = 1000000;
  const STEP = 100;

  const [range, setRange] = useState([
    filterValues.monthlyRentStart || MIN_VALUE,
    filterValues.monthlyRentEnd || MAX_VALUE
  ]);

  useEffect(() => {
    setRange([
      filterValues.monthlyRentStart || MIN_VALUE,
      filterValues.monthlyRentEnd || MAX_VALUE
    ]);
  }, [filterValues]);

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('monthlyRentStart', newRange[0]);
    handleFilterChange('monthlyRentEnd', newRange[1]);
  };

  const formatLabel = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <ReusableRangeSlider
        label="Monthly Rent"
        min={MIN_VALUE}
        max={MAX_VALUE}
        step={STEP}
        unit="₹"
        value={range}
        onChange={handleSliderChange}
        formatLabel={formatLabel}
      />
    </VStack>
  );
};

export default MonthlyRentRangeFilter;