import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack, Box } from '@chakra-ui/react';

const KmDrivenFilter = ({ filterValues, handleFilterChange }) => {
  const kmDrivenOptions = [
    { id: "0 - 10,000 Km", name: "0 - 10,000 Km" },
    { id: "10,000 - 20,000 Km", name: "10,000 - 20,000 Km" },
    { id: "20,000 - 30,000 Km", name: "20,000 - 30,000 Km" },
    { id: "30,000 - 40,000 Km", name: "30,000 - 40,000 Km" },
    { id: "40,000 - 50,000 Km", name: "40,000 - 50,000 Km" },
    { id: "50,000 - 60,000 Km", name: "50,000 - 60,000 Km" },
    { id: "60,000 - 70,000 Km", name: "60,000 - 70,000 Km" },
    { id: "70,000 - 80,000 Km", name: "70,000 - 80,000 Km" },
    { id: "80,000 - 90,000 Km", name: "80,000 - 90,000 Km" },
    { id: "90,000 - 1,00,000 Km", name: "90,000 - 1,00,000 Km" },
    { id: "1,00,000 - 1,50,000 Km", name: "1,00,000 - 1,50,000 Km" },
    { id: "1,50,000 - 2,00,000 Km", name: "1,50,000 - 2,00,000 Km" },
    { id: "Above 2,00,000 Km", name: "Above 2,00,000 Km" }
  ];

  const handleCheckboxChange = (kmDriven) => {
    const updatedKmDriven = filterValues.kmDriven ? [...filterValues.kmDriven] : [];
    if (updatedKmDriven.includes(kmDriven)) {
      updatedKmDriven.splice(updatedKmDriven.indexOf(kmDriven), 1);
    } else {
      updatedKmDriven.push(kmDriven);
    }
    handleFilterChange('kmDriven', updatedKmDriven);
  };

  return (
    <FormControl>
      <FormLabel fontWeight="semibold">Kilometers Driven</FormLabel>
      <Box maxH="200px" overflowY="auto" overflowX="hidden">
        <Stack spacing={2}>
          {kmDrivenOptions.map((option) => (
            <Checkbox
              key={option.id}
              isChecked={filterValues.kmDriven?.includes(option.id) || false}
              onChange={() => handleCheckboxChange(option.id)}
            >
              {option.name}
            </Checkbox>
          ))}
        </Stack>
      </Box>
    </FormControl>
  );
};

export default KmDrivenFilter;