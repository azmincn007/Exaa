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
import { Search, X } from 'lucide-react';
import { SearchImageContext } from './ImageGallery';
import { useLocation } from 'react-router-dom';

function SearchImageGallery() {
  const { setSearchImage } = useContext(SearchImageContext);
  const inputRef = useRef(null);
  const location = useLocation();

  const handleSearch = () => {
    if (inputRef.current) {
      setSearchImage(inputRef.current.value);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSearchImage('');
    }
  };

  const getPlaceholderText = () => {
    return location.pathname === '/image-gallery/category' 
      ? 'Search Categories...'
      : 'Search Images...';
  };

  return (
    <Box position="relative" maxWidth="lg" margin="auto">
      <Box
        className='bg-white text-gray-700'
        borderRadius="lg"
        minWidth="300px"
      >
        <InputGroup size="md">
          <Input
            ref={inputRef}
            pr="8rem"
            type="text"
            placeholder={getPlaceholderText()}
            className="bg-[#F1F1F1] rounded-full w-[100%] max-w-[500px]"
            style={{ flex: 1 }}
          />
          <InputRightElement right="2.5rem"
            cursor="pointer"
            onClick={handleClear}
          >
            <X size={16} className='text-gray-500 hover:text-gray-700'/>
          </InputRightElement>
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