import React from "react";
import { Box, Flex, Grid, GridItem, Skeleton, SkeletonText } from "@chakra-ui/react";

const EditProfileSkeleton = () => {
  return (
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      <Flex
        display={{ base: "column", md: "none" }}
        justify="space-between"
        mb={6}
        className="gap-4 bg-[#0071BC1A] p-4"
      >
        <Skeleton height="20px" width="100px" />
        <Skeleton height="20px" width="120px" />
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 3fr" }}
        gap={6}
      >
        <GridItem display={{ base: "none", md: "block" }} className="min-h-[300px] bg-[#0071BC1A] py-2">
          <Box className="px-2 flex flex-col gap-4">
            <Skeleton height="20px" width="100px" />
            <Skeleton height="20px" width="120px" />
            <Skeleton height="40px" width="150px" mt={4} />
          </Box>
        </GridItem>

        <GridItem className="flex justify-center items-center">
          <Box width="100%" maxWidth="800px">
            <Skeleton height="400px" width="100%" />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};
export default EditProfileSkeleton