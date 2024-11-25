import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    setHasSearched(text.trim() !== '');
  };

  const resetSearch = () => {
    setHasSearched(false);
    setSearchText('');
  };

  return (
    <SearchContext.Provider value={{ hasSearched, searchText, handleSearch, resetSearch, setHasSearched }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);