import React from 'react';
import { FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';

const EngineCCFilter = ({ filterValues, handleFilterChange }) => {
  const engineCCOptions = [
    'Upto 100 cc',
    '100 - 125 cc',
    '125 - 150 cc',
    '150 - 200 cc',
    '200 - 250 cc',
    '250 - 500 cc',
    '1000 and above'
  ];

  const handleCheckboxChange = (engineCC) => {
    const updatedEngineCC = filterValues.engineCC ? [...filterValues.engineCC] : [];
    if (updatedEngineCC.includes(engineCC)) {
      updatedEngineCC.splice(updatedEngineCC.indexOf(engineCC), 1);
    } else {
      updatedEngineCC.push(engineCC);
    }
    handleFilterChange('engineCC', updatedEngineCC);
  };

  return (
    <FormControl>
      <FormLabel>Engine Capacity</FormLabel>
      <Stack maxH="200px" overflowY="auto" spacing={2}>
        {engineCCOptions.map((engineCC) => (
          <Checkbox
            key={engineCC}
            isChecked={filterValues.engineCC?.includes(engineCC) || false}
            onChange={() => handleCheckboxChange(engineCC)}
          >
            {engineCC}
          </Checkbox>
        ))}
      </Stack>
    </FormControl>
  );
};

export default EngineCCFilter;