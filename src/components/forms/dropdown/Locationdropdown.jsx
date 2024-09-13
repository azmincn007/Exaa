import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Box, List, ListItem } from '@chakra-ui/react';
import { FaChevronDown } from "react-icons/fa"

const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose"
];

export const LocationInput = ({ label, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({ target: { name: props.name, value: location } });
    }
  };

  return (
    <FormControl position="relative" mt={4}>
      <Input
        readOnly
        value={selectedLocation}
        onClick={handleToggle}
        pt={4}
        pb={2}
        px={3}
        borderWidth="1px"
        borderColor="black.300"
        className='signup-input'
        _focus={{
          border:'2px solid #3182ce',
          boxShadow: "0  0 2px #3182ce",
        }}
        _hover={{}}
        {...props}
      />
      <FormLabel
        position="absolute"
        top="-2.5"
        left={3}
        px={1}
        fontSize="sm"
        fontWeight="medium"
        color="black.300"
        bg="white"
        zIndex={2}
      >
        {label}
      </FormLabel>
      <Box
        as={FaChevronDown}
        position="absolute"
        right={3}
        top="50%"
        transform="translateY(-50%)"
        color="gray.500"
        pointerEvents="none"
      />
      {isOpen && (
        <List
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          maxH="200px"
          overflowY="auto"
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="sm"
          zIndex={3}
        >
          {locations.map((location) => (
            <ListItem
             
              px={3}
              py={2}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => handleSelect(location)}
            >
              {location}
            </ListItem>
          ))}
        </List>
      )}
    </FormControl>
  );
};

// Include other components (CustomInput, MobileNumberInput, AboutYouInput) here...

export default LocationInput;