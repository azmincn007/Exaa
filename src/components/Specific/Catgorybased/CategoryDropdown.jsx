// CategoryDropdown.js
import React, { useState } from 'react';
import { Box, VStack, Text, Icon, Flex } from '@chakra-ui/react';
import { ChevronDown, ChevronUp, Minus } from 'lucide-react';

const CategoryDropdown = ({ title, items, selectedItemId, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box borderBottom="1px" borderColor="gray.200" py={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text fontWeight="bold" fontSize={["sm", "md"]}>{title}</Text>
        <Icon as={isOpen ? ChevronUp : ChevronDown} boxSize={[3, 4]} />
      </Box>
      {isOpen && (
        <VStack align="stretch" mt={2}>
          {items.map((item) => (
            <Flex
              key={item.id}
              py={1}
              bg={item.id === selectedItemId ? "cyan.100" : "transparent"}
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              onClick={() => onItemClick(item)}
              alignItems="center"
              ml={2}
            >
              <Icon as={Minus} mr={2} boxSize={[2, 3]} />
              <Text fontSize={["xs", "sm"]} color={item.id === selectedItemId ? "black" : "gray.600"}>
                {item.name} {item.count && `(${item.count})`}
              </Text>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default CategoryDropdown;