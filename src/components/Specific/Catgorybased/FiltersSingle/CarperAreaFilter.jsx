import React, { useState } from 'react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const CarpetAreaFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 50;
  const MAX_VALUE = 10000;
  const STEP = 50;

  const [range, setRange] = useState([
    filterValues.carpetAreaStart || MIN_VALUE,
    filterValues.carpetAreaEnd || MAX_VALUE
  ]);

  const updateFilters = (newRange) => {
    handleFilterChange('carpetAreaStart', newRange[0]);
    handleFilterChange('carpetAreaEnd', newRange[1]);
  };

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    updateFilters(newRange);
  };

  const formatLabel = (value) => {
    return `${value.toLocaleString()} sq ft`;
  };

  return (
    <ReusableRangeSlider
      label="Carpet Area"
      min={MIN_VALUE}
      max={MAX_VALUE}
      step={STEP}
      unit="sq ft"
      value={range}
      onChange={handleSliderChange}
      formatLabel={formatLabel}
    />
  );
};

export default CarpetAreaFilter;