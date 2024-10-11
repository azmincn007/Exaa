import React, { useState } from 'react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const YearRangeFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_YEAR = 2000;
  const MAX_YEAR = 2025;
  const STEP = 1;

  const [range, setRange] = useState([
    filterValues.yearStart || MIN_YEAR,
    filterValues.yearEnd || MAX_YEAR
  ]);

  const updateFilters = (newRange) => {
    handleFilterChange('yearStart', newRange[0]);
    handleFilterChange('yearEnd', newRange[1]);
  };

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    updateFilters(newRange);
  };

  const formatLabel = (value) => {
    return `${value}`;
  };

  return (
    <ReusableRangeSlider
      label="Year Range"
      min={MIN_YEAR}
      max={MAX_YEAR}
      step={STEP}
      value={range}
      onChange={handleSliderChange}
      formatLabel={formatLabel}
    />
  );
};

export default YearRangeFilter;