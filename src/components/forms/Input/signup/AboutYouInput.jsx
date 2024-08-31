import React, { useState } from 'react';
import { FormControl, FormLabel, Textarea, Text, FormErrorMessage } from '@chakra-ui/react';

const AboutYouInput = ({ label, register, name, rules = {}, error, ...props }) => {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <FormControl position="relative" mt={4} isInvalid={!!error}>
      <Textarea
        {...props}
        {...(register && name ? register(name, rules) : {})}
        pt={6}
        pb={2}
        px={3}
        borderWidth="1px"
        borderColor="black.300"
        _hover={{ borderColor: "black.300" }}
        _focus={{
          boxShadow: "0 0 0 1px #3182ce",
          borderColor: "black.300",
        }}
        resize="vertical"
        minHeight="100px"
        maxLength={120}
        onChange={handleChange}
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
      <Text
        position="absolute"
        bottom={2}
        right={3}
        fontSize="xs"
        color="gray.500"
      >
        {charCount}/120
      </Text>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default AboutYouInput;