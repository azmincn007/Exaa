import React, { useState, useEffect } from 'react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const SUBCATEGORY_PRICE_RANGES = {
  1: { min: 50000, max: 10000000 },
  2: { min: 50000, max: 10000000 },
  4: { min: 0, max: 10000000 },
  6: { min: 50000, max: 500000000 },
  11: { min: 1000, max: 50000000 },
  12: { min: 500, max: 3000000 },
  13: { min: 500, max: 3000000 },
  14: { min: 500, max: 1000000 },
  15: { min: 500, max: 1000000 },
  16: { min: 500, max: 1000000 },
  18: { min: 1000, max: 100000000 },
  19: { min: 500, max: 1000000 },
  21: { min: 200, max: 500000 },
  22: { min: 500, max: 500000 },
  23: { min: 500, max: 1000000 },
  71: { min: 30, max: 1000000 },
  72: { min: 30, max: 1000000 },
  73: { min: 30, max: 1000000 },








  // Add more subcategories as needed
};

const DEFAULT_RANGE = { min: 0, max: 1000000 };

const PriceRangeFilter = ({ filterValues, handleFilterChange, subCategory }) => {
  const [priceRange, setPriceRange] = useState(DEFAULT_RANGE);
  const [range, setRange] = useState([
    filterValues.priceStart || DEFAULT_RANGE.min,
    filterValues.priceEnd || DEFAULT_RANGE.max
  ]);

  useEffect(() => {
    const newRange = SUBCATEGORY_PRICE_RANGES[subCategory] || DEFAULT_RANGE;
    setPriceRange(newRange);
    setRange([
      filterValues.priceStart || newRange.min,
      filterValues.priceEnd || newRange.max
    ]);
  }, [subCategory, filterValues.priceStart, filterValues.priceEnd]);

  const updateFilters = (newRange) => {
    handleFilterChange('priceStart', newRange[0]);
    handleFilterChange('priceEnd', newRange[1]);
  };

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    updateFilters(newRange);
  };

  const formatLabel = (value) => `${value.toLocaleString()} rs`;

  return (
    <ReusableRangeSlider
      label="Price Range"
      min={priceRange.min}
      max={priceRange.max}
      step={1000}
      unit="rs"
      value={range}
      onChange={handleSliderChange}
      formatLabel={formatLabel}
    />
  );
};

export default PriceRangeFilter;