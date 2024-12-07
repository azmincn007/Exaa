import React, { useState, useRef } from 'react';
import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Box,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Search } from 'lucide-react';

function SearchImageGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box position="relative" maxWidth="lg" margin="auto">
      <Box
        className='bg-white text-gray-700'
        borderRadius="lg"
      >
        <InputGroup size="md">
          <Input
            ref={inputRef}
            pr="4.5rem"
            type="text"
            placeholder="Search Images..."
            className=" bg-[#F1F1F1] rounded-full w-[500px]"
            value={searchTerm}
            onChange={handleInputChange}
            style={{ flex: 1 }}
          />
          <InputRightElement
            className='bg-blue-500 searchbutton rounded-r-full'
            width="2.5rem"
          >
         
              <Search size={16} className='text-white'/>
            
          </InputRightElement>
        </InputGroup>
      </Box>
      {/* Suggestions or gallery items can be added here later */}
    </Box>
  );
}

export default SearchImageGallery;