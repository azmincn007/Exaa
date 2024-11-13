import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Box,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { Search } from 'lucide-react';
import { BASE_URL } from '../../../config/config';
import { useSearch } from '../../../Hooks/SearchContext';

const fetchSuggestions = async (search, isShowroom, userToken) => {
  if (!search) return [];
  const endpoint = isShowroom
    ? `/api/find-showrooms-search-suggestion?search=${search}`
    : `/api/find-home-page-search-ads-suggestion?search=${search}`;
  
  const headers = isShowroom && userToken
    ? { 'Authorization': `Bearer ${userToken}` }
    : {};

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    const data = await response.json();
    console.log('API Response:', data);
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

function SearchComponent({ isShowroom }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const { handleSearch, searchText } = useSearch();

  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    setUserToken(token);
  }, []);

  useEffect(() => {
    setSearchTerm(searchText);
  }, [searchText]);

  const { data: suggestions, error, isLoading } = useQuery(
    ['suggestions', searchTerm, isShowroom, userToken],
    () => fetchSuggestions(searchTerm, isShowroom, userToken),
    {
      enabled: !!searchTerm && !!userToken,
      refetchOnWindowFocus: false,
    }
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <VStack spacing={0} align="stretch" maxWidth="md" margin="auto">
      <Box
        className='bg-white text-gray-700'
        borderRadius="lg"
        position="relative"
      >
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type="text"
            placeholder="Find Cars, Mobile Phones and more..."
            className="border-gray-300"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <InputRightElement
            className='bg-blue-500 searchbutton'
            width="2.5rem"
          >
            <Button
              h="1.75rem"
              size="sm"
              className="bg-blue-500 text-white"
              onClick={() => {
                handleSearch(searchTerm);
                setShowSuggestions(false);
              }}
            >
              <Search size={16} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
      {showSuggestions && !isLoading && !error && suggestions && suggestions.length > 0 && (
        <Box
          className="border border-gray-200 rounded-md bg-white shadow-md absolute z-10 w-full max-w-md"
        >
          <List className="space-y-2 p-2">
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md text-black"
              >
                {suggestion}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </VStack>
  );
}

export default SearchComponent;