// BuyYearRangeFilter.js
import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const BuyYearRangeFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 2010;
  const MAX_VALUE = 2025;
  const STEP = 1;

  const [range, setRange] = useState([
    filterValues.buyYearStart || MIN_VALUE,
    filterValues.buyYearEnd || MAX_VALUE
  ]);

  useEffect(() => {
    setRange([
      filterValues.buyYearStart || MIN_VALUE,
      filterValues.buyYearEnd || MAX_VALUE
    ]);
  }, [filterValues]);

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('buyYearStart', newRange[0]);
    handleFilterChange('buyYearEnd', newRange[1]);
  };

  const formatLabel = (value) => {
    return `${value}`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <ReusableRangeSlider
        label="Buy Year"
        min={MIN_VALUE}
        max={MAX_VALUE}
        step={STEP}
        value={range}
        onChange={handleSliderChange}
        formatLabel={formatLabel}
      />
    </VStack>
  );
};

export default BuyYearRangeFilter;