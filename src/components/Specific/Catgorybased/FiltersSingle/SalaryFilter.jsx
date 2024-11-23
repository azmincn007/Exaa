import React, { useState } from 'react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const SalaryFilter = ({ filterValues, handleFilterChange }) => {
  const MIN_VALUE = 5000;
  const MAX_VALUE = 100000;
  const STEP = 1000;

  const [range, setRange] = useState([
    filterValues.salaryStart || MIN_VALUE,
    filterValues.salaryEnd || MAX_VALUE
  ]);

  const updateFilters = (newRange) => {
    handleFilterChange('salaryStart', newRange[0]);
    handleFilterChange('salaryEnd', newRange[1]);
  };

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    updateFilters(newRange);
  };

  const formatLabel = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <ReusableRangeSlider
      label="Salary"
      min={MIN_VALUE}
      max={MAX_VALUE}
      step={STEP}
      unit="₹"
      value={range}
      onChange={handleSliderChange}
      formatLabel={formatLabel}
    />
  );
};

export default SalaryFilter;