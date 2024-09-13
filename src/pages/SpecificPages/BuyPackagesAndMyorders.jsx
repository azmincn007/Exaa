import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Select,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { CiCircleInfo, CiLocationOn } from 'react-icons/ci';

function BuyPackagesAndMyorders() {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [location, setLocation] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);

  const fontSize = useBreakpointValue({ base: "lg", md: "xl" });
  const inputFontSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    setIsFormComplete(category !== '' && subcategory !== '' && location !== '');
  }, [category, subcategory, location]);

  return (
    <div className='min-h-[100vh]'>
      <div className='flex justify-center items-center min-h-[100vh]'>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          width='80%'
          maxWidth="600px"
          margin="auto"
          borderColor='black'
        >
          <Text fontSize={fontSize} fontWeight="bold" mb={4} textAlign="center">
            SELECT OPTIONS TO SHOW PACKAGES
          </Text>
          <VStack spacing={4} align="stretch">
            <Select 
              placeholder="Select Category*" 
              borderColor="black"
              fontSize={inputFontSize}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              _hover={{ borderColor: "black" }}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>

            <Select 
              placeholder="Select Subcategory" 
              borderColor="black"
              fontSize={inputFontSize}
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              _hover={{ borderColor: "black" }}
            >
              <option value="suboption1">Suboption 1</option>
              <option value="suboption2">Suboption 2</option>
              <option value="suboption3">Suboption 3</option>
            </Select>

            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <CiLocationOn color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Enter Location" 
                borderColor="black"
                fontSize={inputFontSize}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                _hover={{ borderColor: "black" }}
              />
            </InputGroup>

            <Button 
              bg={isFormComplete ? "blue.500" : "gray.500"}
              color="white"
              isFullWidth
              fontSize={inputFontSize}
              _hover={{ bg: isFormComplete ? "blue.600" : "gray.500" }}
              _active={{ bg: isFormComplete ? "blue.700" : "gray.500" }}
            >
              Show Packages
            </Button>
          </VStack>
        </Box>

      </div>

    </div>
  );
}

export default BuyPackagesAndMyorders;