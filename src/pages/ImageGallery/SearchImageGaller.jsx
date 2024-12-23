import React, { useState, useRef, useContext } from 'react';
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
import { SearchImageContext } from './ImageGallery';

function SearchImageGallery() {
  const { setSearchImage } = useContext(SearchImageContext);
  const inputRef = useRef(null);

  const handleSearch = () => {
    if (inputRef.current) {
      setSearchImage(inputRef.current.value);
    }
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
            className=" bg-[#F1F1F1] rounded-full w-[100%] max-w-[500px]"
            style={{ flex: 1 }}
          />
          <InputRightElement
            className='bg-blue-500 searchbutton rounded-r-full'
            width="2.5rem"
            onClick={handleSearch}
            cursor="pointer"
          >
            <Search size={16} className='text-white'/>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
}

export default SearchImageGallery;