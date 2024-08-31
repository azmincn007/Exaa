import React from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

const CustomInput = ({ label, register, name, rules = {}, error, ...props }) => {
  return (
    <FormControl position="relative" mt={4} isInvalid={!!error}>
      <Input
        {...props}
        {...(register && name ? register(name, rules) : {})}
        pt={4}
        pb={2}
        px={3}
        borderWidth="1px"
        borderColor="black.300"
        className='signup-input'
        _hover={{ borderColor: "black.300" }}
        _focus={{
          boxShadow: "0 0 0 1px #3182ce",
          borderColor: "black.300",
        }}
      />
      <FormLabel
        position="absolute"
        top="-2.5"
        left={3}
        px={1}
        fontSize="sm"
        fontWeight="medium"
        color="black.300"
        bg="white"
        zIndex={2}
      >
        {label}
      </FormLabel>
      {error && <FormErrorMessage className='text-[12px]'>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default CustomInput;