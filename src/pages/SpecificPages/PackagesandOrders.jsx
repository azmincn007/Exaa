import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, VStack, Text, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel, Center, Icon } from '@chakra-ui/react';
import { FiSearch, FiFileText, FiCreditCard } from 'react-icons/fi';

const EmptyState = ({ icon, title, description }) => {
  const IconComponent = {
    FiSearch,
    FiFileText,
    FiCreditCard
  }[icon] || FiSearch;

  return (
    <Center height="64">
      <VStack spacing={2}>
        <Icon as={IconComponent} boxSize={12} color="gray.400" />
        <Text fontSize="xl" fontWeight="semibold">{title}</Text>
        <Text color="gray.500">{description}</Text>
      </VStack>
    </Center>
  );
};

const PackagesAndOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState('packages');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setSelectedMenuItem(path);
  }, [location]);

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    navigate(`/packages-and-orders/${item}`);
  };

  const getEmptyStateData = () => {
    switch (selectedMenuItem) {
      case 'invoices':
        return {
          icon: 'FiFileText',
          title: 'No invoices yet',
          description: 'You don\'t have any invoices at the moment'
        };
      case 'billing':
        return {
          icon: 'FiCreditCard',
          title: 'No billing information',
          description: 'You haven\'t set up any billing information yet'
        };
      default:
        return {
          icon: 'FiSearch',
          title: 'Nothing here...',
          description: 'You don\'t have any active packages'
        };
    }
  };

  const renderContent = () => {
    if (selectedMenuItem === 'packages') {
      return (
        <Tabs>
          <TabList borderBottomColor="gray.200">
            <Tab fontWeight="semibold" width="30%">ACTIVE</Tab>
            <Tab fontWeight="semibold" width="30%">SCHEDULED</Tab>
            <Tab fontWeight="semibold" width="30%">EXPIRED</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <EmptyState {...getEmptyStateData()} />
            </TabPanel>
            <TabPanel>
              <EmptyState {...getEmptyStateData()} />
            </TabPanel>
            <TabPanel>
              <EmptyState {...getEmptyStateData()} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      );
    } else {
      return <EmptyState {...getEmptyStateData()} />;
    }
  };

  return (
    <Box maxWidth="container.xl" margin="auto" padding={8} className='font-Inter h-[400px]'>
      <Grid templateColumns="1fr 3fr" gap={6}>
        <GridItem>
          <VStack align="stretch" spacing={4} bg="none" borderRadius="lg" p={6}>
            <Text
              fontWeight="semibold"
              cursor="pointer"
              color={selectedMenuItem === 'packages' ? 'blue.500' : 'inherit'}
              onClick={() => handleMenuItemClick('packages')}
            >
              Bought packages
            </Text>
            <Text
              cursor="pointer"
              color={selectedMenuItem === 'billing' ? 'blue.500' : 'inherit'}
              onClick={() => handleMenuItemClick('billing')}
            >
              Billing
            </Text>
            <Text
              cursor="pointer"
              color={selectedMenuItem === 'invoices' ? 'blue.500' : 'inherit'}
              onClick={() => handleMenuItemClick('invoices')}
            >
              Invoices
            </Text>
          </VStack>
        </GridItem>
        <GridItem>
          {renderContent()}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PackagesAndOrders;