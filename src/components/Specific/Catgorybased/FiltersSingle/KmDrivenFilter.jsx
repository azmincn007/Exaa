import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const KmDrivenFilter = ({ filterValues, handleFilterChange }) => {
  const kmDrivenOptions = [
    { id: "0-10000", name: "0 - 10,000 Km" },
    { id: "10000-20000", name: "10,000 - 20,000 Km" },
    { id: "20000-30000", name: "20,000 - 30,000 Km" },
    { id: "30000-40000", name: "30,000 - 40,000 Km" },
    { id: "40000-50000", name: "40,000 - 50,000 Km" },
    { id: "50000-60000", name: "50,000 - 60,000 Km" },
    { id: "60000-70000", name: "60,000 - 70,000 Km" },
    { id: "70000-80000", name: "70,000 - 80,000 Km" },
    { id: "80000-90000", name: "80,000 - 90,000 Km" },
    { id: "90000-100000", name: "90,000 - 1,00,000 Km" },
    { id: "100000-150000", name: "1,00,000 - 1,50,000 Km" },
    { id: "150000-200000", name: "1,50,000 - 2,00,000 Km" },
    { id: "200000+", name: "Above 2,00,000 Km" }
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
      <FormLabel>Kilometers Driven</FormLabel>
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
    </FormControl>
  );
};

export default KmDrivenFilter;