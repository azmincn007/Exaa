import React from 'react';
import { Box, Flex, VStack, Skeleton } from '@chakra-ui/react';

const PackagesSkeleton = () => {
  return (
    <Box mx="auto" p={6} bg="#1a2332" color="white" borderRadius="lg" boxShadow="lg" position="relative" className="mt-4 rounded-lg font-Inter w-[80%]">
      <VStack spacing={6} align="center" mb={6}>
        <Skeleton height="24px" width="150px" />
        <Skeleton height="116px" width="140px" />
        <VStack spacing={2} align="start" width="100%">
          {[1, 2, 3].map((i) => (
            <Flex key={i} alignItems="center" className="gap-2" width="100%">
              <Skeleton height="20px" width="20px" />
              <Skeleton height="20px" width="80%" />
            </Flex>
          ))}
        </VStack>
      </VStack>

      <Box bg="white" color="black" borderRadius="md" p={4}>
        <Flex justifyContent="center" mb={4}>
          <Skeleton height="40px" width="40%" />
        </Flex>
        <VStack spacing={4} align="stretch">
          <Skeleton height="24px" width="60%" />
          {[1, 2].map((i) => (
            <Flex key={i} alignItems="center" mt={2}>
              <Skeleton height="16px" width="16px" mr={2} />
              <Skeleton height="16px" width="80%" />
            </Flex>
          ))}
          <Flex justifyContent="space-between" mt={4}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="200px" width="30%" borderRadius="md" />
            ))}
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default PackagesSkeleton;