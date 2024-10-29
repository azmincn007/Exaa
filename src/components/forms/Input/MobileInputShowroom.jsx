import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

const PhoneInputShowroom = React.forwardRef(({ onChange, onBlur, name, error, value }, ref) => {
  // Remove the +91 prefix if it exists in the value
  const displayValue = value && value.startsWith('+91') ? value.slice(3) : value;

  return (
    <InputGroup className=" border-black">
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
        value={displayValue || ''}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue); // Pass only the number without +91
        }}
        onBlur={onBlur}
        placeholder="Enter 10 digit number"
        maxLength={10}
      />
    </InputGroup>
  );
});

export default PhoneInputShowroom;