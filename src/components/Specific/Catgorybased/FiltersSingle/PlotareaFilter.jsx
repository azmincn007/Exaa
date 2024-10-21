import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const PlotAreaRangeFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 0;
  const MAX_VALUE = 50000;
  const STEP = 100;

  const [range, setRange] = useState([
    filterValues.plotAreaStart || MIN_VALUE,
    filterValues.plotAreaEnd || MAX_VALUE
  ]);

  useEffect(() => {
    setRange([
      filterValues.plotAreaStart || MIN_VALUE,
      filterValues.plotAreaEnd || MAX_VALUE
    ]);
  }, [filterValues]);

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('plotAreaStart', newRange[0]);
    handleFilterChange('plotAreaEnd', newRange[1]);
  };

  const formatLabel = (value) => {
    return `${value.toLocaleString()} cent`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <ReusableRangeSlider
        label="Plot Area"
        min={MIN_VALUE}
        max={MAX_VALUE}
        step={STEP}
        unit="cent"
        value={range}
        onChange={handleSliderChange}
        formatLabel={formatLabel}
      />
    </VStack>
  );
};

export default PlotAreaRangeFilter;