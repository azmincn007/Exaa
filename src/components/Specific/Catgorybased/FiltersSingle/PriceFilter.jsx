import React, { useState, useEffect } from 'react';
import ReusableRangeSlider from '../ReusableRangeSliderComponent';

const PriceRangeFilter = ({ filterValues, handleFilterChange, minPrice, maxPrice }) => {
  const [range, setRange] = useState([
    filterValues.priceStart || minPrice,
    filterValues.priceEnd || maxPrice
  ]);

  useEffect(() => {
    const newStart = filterValues.priceStart !== null ? filterValues.priceStart : minPrice;
    const newEnd = filterValues.priceEnd !== null ? filterValues.priceEnd : maxPrice;
    setRange([newStart, newEnd]);

    // Update filter values if they're not set
    if (filterValues.priceStart === null || filterValues.priceEnd === null) {
      handleFilterChange('priceStart', newStart);
      handleFilterChange('priceEnd', newEnd);
    }
  }, [filterValues.priceStart, filterValues.priceEnd, minPrice, maxPrice, handleFilterChange]);

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('priceStart', newRange[0]);
    handleFilterChange('priceEnd', newRange[1]);
  };

  const formatLabel = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <ReusableRangeSlider
      label="Price Range"
      min={minPrice}
      max={maxPrice}
      step={1000}
      value={range}
      onChange={handleSliderChange}
      formatLabel={formatLabel}
    />
  );
};

export default PriceRangeFilter;