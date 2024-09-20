import React from 'react';
import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Box,
} from "@chakra-ui/react";
import { FaSearch } from 'react-icons/fa';

function SearchComponent() {
  const handleSearch = () => {
    // Implement your search logic here
    console.log("Search button clicked");
  };

  return (
    <Box 
      maxWidth="md" 
      margin="auto" 
      className='bg-white text-exagray'
      borderRadius="lg"
      
    >
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Find Cars, Mobile Phones and more..."
          borderColor="gray.300"
          
        />
        <InputRightElement 
          className='bg-exablue searchbutton' 
          width="2.5rem"
         
        >
          <Button
            h="1.75rem"
            size="sm"
            colorScheme="exablue"
            onClick={handleSearch}
            leftIcon={<FaSearch />}
          >
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

export default SearchComponent;