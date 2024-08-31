// CountryAndLanguageDropdowns.jsx
import { Select, Stack } from '@chakra-ui/react';
import React from 'react';

export function CountryDropDown() {
  return (
    <div  className='navdropdown text-exagrey font-Inter py-2 ' >
      <Stack spacing={3}>
        <Select placeholder='Kochi' variant="filled">
          <option value='us'>Kochi</option>
          <option value='ca'>Kochi</option>
          <option value='in'>Kochi</option>
        </Select>
      </Stack>
    </div>
  );
}

export function LanguageDropDown() {
  return (
    <div className='navdropdown text-exagrey '>
      <Stack spacing={3}>
        <Select placeholder='Language' variant="filled">
          <option value='en'>English</option>
          <option value='fr'>French</option>
          <option value='es'>Spanish</option>
        </Select>
      </Stack>
    </div>
  );
}
