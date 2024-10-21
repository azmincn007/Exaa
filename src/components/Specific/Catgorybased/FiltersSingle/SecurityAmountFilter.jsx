import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const SecurityAmountRangeFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 0;
  const MAX_VALUE = 5000000; // 50 lakhs
  const STEP = 1000;

  const [range, setRange] = useState([
    filterValues.securityAmountStart || MIN_VALUE,
    filterValues.securityAmountEnd || MAX_VALUE
  ]);

  useEffect(() => {
    setRange([
      filterValues.securityAmountStart || MIN_VALUE,
      filterValues.securityAmountEnd || MAX_VALUE
    ]);
  }, [filterValues]);

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('securityAmountStart', newRange[0]);
    handleFilterChange('securityAmountEnd', newRange[1]);
  };

  const formatLabel = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <ReusableRangeSlider
        label="Security Amount"
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

export default SecurityAmountRangeFilter;