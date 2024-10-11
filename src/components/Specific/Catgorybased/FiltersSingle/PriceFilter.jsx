import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Flex,
  Tooltip
} from '@chakra-ui/react';

const PriceFilter = ({ filterValues, handleFilterChange }) => {
  const [showTooltip, setShowTooltip] = React.useState([false, false]);
  const [range, setRange] = React.useState([100, 1000]);

  useEffect(() => {
    if (filterValues.priceStart?.length > 0 && filterValues.priceEnd?.length > 0) {
      setRange([
        parseInt(filterValues.priceStart[0]),
        parseInt(filterValues.priceEnd[0])
      ]);
    }
  }, [filterValues.priceStart, filterValues.priceEnd]);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    handleFilterChange('priceStart', [newRange[0].toString()]);
    handleFilterChange('priceEnd', [newRange[1].toString()]);
  };

  return (
    <Card variant="elevated">
      <CardHeader pb={0}>
        <Text fontSize="md" fontWeight="medium">Price Range</Text>
      </CardHeader>
      <CardBody>
        <Box px={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">₹{range[0]}</Text>
            <Text fontSize="sm" color="gray.600">₹{range[1]}</Text>
          </Flex>
          <RangeSlider
            aria-label={['min price', 'max price']}
            defaultValue={[100, 1000]}
            value={range}
            min={100}
            max={1000}
            step={10}
            onChange={handleRangeChange}
            onMouseEnter={() => setShowTooltip([true, true])}
            onMouseLeave={() => setShowTooltip([false, false])}
          >
            <RangeSliderTrack bg="gray.200">
              <RangeSliderFilledTrack bg="blue.500" />
            </RangeSliderTrack>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip[0]}
              label={`₹${range[0]}`}
            >
              <RangeSliderThumb 
                index={0} 
                boxSize={6}
                _focus={{ boxShadow: "outline" }}
              />
            </Tooltip>
            <Tooltip
              hasArrow
              bg="blue.500"
              color="white"
              placement="top"
              isOpen={showTooltip[1]}
              label={`₹${range[1]}`}
            >
              <RangeSliderThumb 
                index={1} 
                boxSize={6}
                _focus={{ boxShadow: "outline" }}
              />
            </Tooltip>
          </RangeSlider>
        </Box>
      </CardBody>
    </Card>
  );
};

export default PriceFilter;