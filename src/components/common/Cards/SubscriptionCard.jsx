import React from 'react';
import {
  Box,
  VStack,
  Text,
  Progress,
  Flex,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';

const SubscriptionCard = ({ 
  amount, 
  totalAdCount,
  remainingAdCount,
  totalTagCount,
  remainingTagCount,
  transactionExpiryTime,
  isExpired = false,
  isBoost = false
}) => {
  const expiryDate = new Date(transactionExpiryTime).toLocaleDateString();
  
  // Calculate values based on package type
  const total = isBoost ? totalTagCount : totalAdCount;
  const remaining = isBoost ? remainingTagCount : remainingAdCount;
  const used = total - remaining;
  // Update progress calculation to ensure it's 100% when all items are used
  const progress = (used / total) * 100;

  // Use color mode values for subtle theming
  const borderColor = useColorModeValue('black', 'black');
  const bgColor = useColorModeValue('transparent', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      p={6}
      mb={4}
      bg={bgColor}
      transition="all 0.2s"
      _hover={{
        borderColor: 'gray.200',
        bg: hoverBg,
        transform: 'translateY(-1px)',
        boxShadow: 'sm'
      }}
    >
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold">
            {isBoost ? 'Boost Package' : 'Ad Package'}
          </Text>
          <Badge
            colorScheme={isExpired ? "red" : "green"}
            variant="subtle"
            px={2}
            py={1}
            bg={isExpired ? "red.50" : "green.50"}
            color={isExpired ? "red.600" : "green.600"}
          >
            {isExpired ? "Expired on" : "Active until"} {expiryDate}
          </Badge>
        </Flex>

        <Flex justify="space-between" align="center">
          <Text color="gray.600">Amount Paid</Text>
            <Text fontWeight="bold" color="green.500">
              ₹ {amount}
            </Text>
        </Flex>

        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">
              {isBoost ? `Tags Used: ${used}/${total}` : `Ads Used: ${used}/${total}`}
            </Text>
            <Text fontSize="sm" fontWeight="medium" color="blue.500">
              {remaining} remaining
            </Text>
          </Flex>
          <Progress
            value={progress}
            size="sm"
            colorScheme={isExpired ? "gray" : "blue"}
            borderRadius="full"
            bg="gray.100"
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default SubscriptionCard;