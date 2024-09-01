import React from 'react';
import { Box, VStack, Text, Grid, GridItem, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Center, Icon } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

const PackagesAndOrders = () => {
  return (
    <Box maxWidth="container.xl" margin="auto" padding={8} className='font-Inter'>
      <Grid templateColumns="1fr 3fr" gap={6}>
        <GridItem>
          <VStack align="stretch" spacing={4} bg="white" borderRadius="lg" p={6}>
            <Text fontWeight="semibold">Bought packages</Text>
            <Text fontWeight="semibold">Billing</Text>
            <Text fontWeight="semibold">Invoices</Text>
          </VStack>
        </GridItem>
        <GridItem>
          <Tabs>
            <TabList borderBottomColor="gray.200">
              <Tab fontWeight="semibold" width="30%">ACTIVE</Tab>
              <Tab fontWeight="semibold" width="30%">SCHEDULED</Tab>
              <Tab fontWeight="semibold" width="30%">EXPIRED</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <EmptyState />
              </TabPanel>
              <TabPanel>
                <EmptyState />
              </TabPanel>
              <TabPanel>
                <EmptyState />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Box>
  );
};

const EmptyState = () => (
  <Center height="64">
    <VStack spacing={2}>
      <Icon as={FiSearch} boxSize={12} color="gray.400" />
      <Text fontSize="xl" fontWeight="semibold">Nothing here...</Text>
      <Text color="gray.500">You don't have any active packages</Text>
    </VStack>
  </Center>
);

export default PackagesAndOrders;