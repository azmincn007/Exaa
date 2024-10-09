import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const NoOfOwnersFilter = ({ filterValues, handleFilterChange }) => {
  const ownerOptions = [
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "3", name: "3" },
    { id: "4", name: "4" },
    { id: "5+", name: "5+" }
  ];

  const handleCheckboxChange = (owner) => {
    const updatedOwners = filterValues.noOfOwners ? [...filterValues.noOfOwners] : [];
    if (updatedOwners.includes(owner)) {
      updatedOwners.splice(updatedOwners.indexOf(owner), 1);
    } else {
      updatedOwners.push(owner);
    }
    handleFilterChange('noOfOwners', updatedOwners);
  };

  return (
    <FormControl>
      <FormLabel>Number of Owners</FormLabel>
      <Stack spacing={2}>
        {ownerOptions.map((option) => (
          <Checkbox
            key={option.id}
            isChecked={filterValues.noOfOwners?.includes(option.id) || false}
            onChange={() => handleCheckboxChange(option.id)}
          >
            {option.name}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default NoOfOwnersFilter;