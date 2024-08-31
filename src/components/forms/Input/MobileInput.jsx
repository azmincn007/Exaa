import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';

function MobileInput({ register, errors }) {
  return (
    <FormControl isInvalid={errors.phoneNumber}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<span style={{ fontWeight: 'bold', color: 'black' }}>+91</span>}
        />
        <Input
          type="tel"
          placeholder='Phone Number'
          maxLength={10}
          pl="50px"
          border="2px"
          borderColor="black"
          _focus={{ borderColor: "black" }}
          _hover={{ borderColor: "black" }}
          {...register('phoneNumber', { required: true, maxLength: 10 })}
        />
      </InputGroup>
      {errors.phoneNumber && (
        <FormErrorMessage>Phone number must be 10 digits</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default MobileInput;
