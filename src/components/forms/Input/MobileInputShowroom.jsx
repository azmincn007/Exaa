import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";

const PhoneInputShowroom = React.forwardRef(({ onChange, onBlur, name, error }, ref) => {
    return (
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children="+91"
        />
        <Input
          pl="50px"
          type="tel"
          ref={ref}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Enter 10 digit number"
          maxLength={10}
        />
      </InputGroup>
    );
  });

  export default PhoneInputShowroom