import React from 'react';
import {
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';

function EmailInput({ register, errors }) {
  return (
    <FormControl isInvalid={errors.email}>
      <Input
        type="email"
        placeholder='Email Address'
        border="2px"
        borderColor="black"
        _focus={{ borderColor: "black" }}
        _hover={{ borderColor: "black" }}
        {...register('email', { required: true })}
      />
      {errors.email && (
        <FormErrorMessage>Email is required</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default EmailInput;
