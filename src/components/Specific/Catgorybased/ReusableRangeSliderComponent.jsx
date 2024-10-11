import React from 'react';
import {
  FormControl,
  FormLabel,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Box,
  Flex
} from '@chakra-ui/react';

const ReusableRangeSlider = ({
  label,
  min,
  max,
  step,
  unit,
  value,
  onChange,
  formatLabel
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Box px={4} pt={4}>
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm" color="gray.600">
            {formatLabel(value[0])}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {formatLabel(value[1])}
          </Text>
        </Flex>
        <RangeSlider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          aria-label={['min', 'max']}
        >
          <RangeSliderTrack bg="black">
            <RangeSliderFilledTrack bg="gray.600" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} bg="white" borderColor="black" />
          <RangeSliderThumb index={1} bg="white" borderColor="black" />
        </RangeSlider>
        <Text fontSize="sm" color="gray.600" mt={2} textAlign="center">
          Range: {formatLabel(value[0])} - {formatLabel(value[1])}
        </Text>
      </Box>
    </FormControl>
  );
};

export default ReusableRangeSlider;