import React from 'react';
import { FormControl, FormLabel, Input, InputGroup, InputLeftElement, Text, FormErrorMessage } from '@chakra-ui/react';

const MobileNumberInput = ({ label, register, name, rules = {}, error, ...props }) => {
  const inputRef = React.useRef(null);

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  };

  return (
    <FormControl position="relative" mt={4} isInvalid={!!error}>
      <InputGroup className='flex items-center'>
        <InputLeftElement
          pointerEvents="none"
          height="100%"
          children={
            <Text color="gray.500" fontWeight="bold" fontSize="sm">
              +91
            </Text>
          }
        />
        <Input
          ref={inputRef}
          {...props}
          {...(register && name ? register(name, {
            ...rules,
            onChange: (e) => {
              handleInput(e);
              if (rules.onChange) rules.onChange(e);
            }
          }) : {})}
          type="tel"
          pt={4}
          pb={2}
          pl="45px"
          borderWidth="1px"
          borderColor={error ? "red.500" : "black.300"}
          _hover={{ borderColor: error ? "red.500" : "black.300" }}
          _focus={{
            boxShadow: error ? "0 0 0 1px #E53E3E" : "0 0 0 1px #3182ce",
            borderColor: error ? "red.500" : "black.300",
          }}
          onInput={handleInput}
        />
      </InputGroup>
      <FormLabel
        position="absolute"
        top="-2.5"
        left={3}
        px={1}
        fontSize="sm"
        fontWeight="medium"
        color={error ? "red.500" : "black.300"}
        bg="white"
        zIndex={2}
      >
        {label}
      </FormLabel>
      {error && <FormErrorMessage className='text-[12px]'>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default MobileNumberInput;