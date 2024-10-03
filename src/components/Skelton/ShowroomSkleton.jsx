import React from 'react';
import { Box, Grid, GridItem, VStack, Skeleton } from "@chakra-ui/react";

const ShowroomSkeleton = () => {
  return (
    <Box maxWidth="container" margin="auto" padding={8}>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(6, 1fr)",
          lg: "repeat(12, 1fr)",
        }}
        gap={6}
      >
        <GridItem 
          colSpan={{ base: 1, md: 6, lg: 4 }} 
          bg="#0071BC1A" 
          height={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          overflowX="hidden"
          position="relative"
        >
          <VStack spacing={4} align="stretch" p={4}>
            {[...Array(3)].map((_, index) => (
              <Box key={index} borderRadius="xl" overflow="hidden" bg="#23496C" height="200px">
                <Skeleton height="100px" width="100%" />
                <Box p={2}>
                  <Skeleton height="20px" width="80%" mb={2} />
                  <Skeleton height="16px" width="60%" mb={2} />
                  <Skeleton height="16px" width="40%" />
                </Box>
              </Box>
            ))}
            <Skeleton height="48px" width="100%" borderRadius="xl" />
          </VStack>
        </GridItem>

        <GridItem
          colSpan={{ base: 1, md: 6, lg: 8 }}
          bg="#0071BC1A"
          minHeight="300px"
          borderRadius="xl"
          boxShadow="md"
          p={6}
        >
          <VStack spacing={4} align="stretch" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Skeleton height="24px" width="200px" />
              <Skeleton height="40px" width="150px" />
            </Box>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} height="100px" width="100%" borderRadius="xl" />
            ))}
            <Skeleton height="48px" width="200px" alignSelf="center" mt={4} />
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ShowroomSkeleton;