import React, { useState, useEffect } from 'react';
import { 
  Box, Text, Button, RangeSlider, RangeSliderTrack, 
  RangeSliderFilledTrack, RangeSliderThumb, Flex 
} from '@chakra-ui/react';

const PriceSlider = ({ category, onApply }) => {
  const [range, setRange] = useState([0, 100]);
  const minPrice = 1;
  const maxPrice = 1000000; // 10 Lakh

  useEffect(() => {
    // Reset the range when the category changes
    setRange([0, 100]);
  }, [category]);

  const logScale = (value) => {
    return Math.exp(Math.log(maxPrice) * value / 100) - 1;
  };

  const inverseLogScale = (value) => {
    return Math.log(value + 1) / Math.log(maxPrice) * 100;
  };

  const handleChange = (newRange) => {
    setRange(newRange);
  };

  const formatValue = (value) => {
    const price = Math.round(logScale(value));
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  const handleApply = () => {
    const appliedRange = range.map(logScale).map(Math.round);
    onApply(appliedRange);
  };

  if (category === 'Jobs') {
    return null;
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
        Choose a price range
      </Text>
      <RangeSlider
        aria-label={['min', 'max']}
        min={0}
        max={100}
        step={1}
        value={range}
        onChange={handleChange}
        colorScheme="teal"
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
      <Flex justify="space-between" mt={2}>
        <Text fontSize="sm">{formatValue(range[0])}</Text>
        <Text fontSize="sm">{formatValue(range[1])}</Text>
      </Flex>
      <Button
        mt={4}
        colorScheme="teal"
        size="sm"
        onClick={handleApply}
      >
        Apply
      </Button>
    </Box>
  );
};

export default PriceSlider;