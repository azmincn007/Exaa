import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const LandAreaRangeFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 50;
  const MAX_VALUE = 10000;
  const STEP = 50;

  const [range, setRange] = useState([
    filterValues.totalLandAreaStart || MIN_VALUE,
    filterValues.totalLandAreaEnd || MAX_VALUE
  ]);

  useEffect(() => {
    setRange([
      filterValues.totalLandAreaStart || MIN_VALUE,
      filterValues.totalLandAreaEnd || MAX_VALUE
    ]);
  }, [filterValues]);

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('totalLandAreaStart', newRange[0]);
    handleFilterChange('totalLandAreaEnd', newRange[1]);
  };

  const formatLabel = (value) => {
    return `${value.toLocaleString()} cents`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <ReusableRangeSlider
        label="Total Land Area"
        min={MIN_VALUE}
        max={MAX_VALUE}
        step={STEP}
        unit="cents"
        value={range}
        onChange={handleSliderChange}
        formatLabel={formatLabel}
      />
    </VStack>
  );
};

export default LandAreaRangeFilter;