import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import SubscriptionCard from '../../components/common/Cards/SubscriptionCard';
import { BASE_URL } from '../../config/config';
import { useAuth } from '../../Hooks/AuthContext';

const EmptyState = ({ title, description }) => {
  return (
    <Center height="64">
      <VStack spacing={2}>
        <Icon as={FiSearch} boxSize={12} color="gray.400" />
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
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
  const [activeBoosts, setActiveBoosts] = useState([]);
  const [expiredBoosts, setExpiredBoosts] = useState([]);
  const [activeLoading, setActiveLoading] = useState(false);
  const [expiredLoading, setExpiredLoading] = useState(false);
  const [activeBoostLoading, setActiveBoostLoading] = useState(false);
  const [expiredBoostLoading, setExpiredBoostLoading] = useState(false);
  const [activeError, setActiveError] = useState(null);
  const [expiredError, setExpiredError] = useState(null);
  const [activeBoostError, setActiveBoostError] = useState(null);
  const [expiredBoostError, setExpiredBoostError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeShowroomSubs, setActiveShowroomSubs] = useState([]);
  const [expiredShowroomSubs, setExpiredShowroomSubs] = useState([]);
  const [activeShowroomLoading, setActiveShowroomLoading] = useState(false);
  const [expiredShowroomLoading, setExpiredShowroomLoading] = useState(false);
  const [activeShowroomError, setActiveShowroomError] = useState(null);
  const [expiredShowroomError, setExpiredShowroomError] = useState(null);

  const { isLoggedIn, isInitialized } = useAuth();

  // 3. The useEffect hook that handles the navigation
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate("/");
    }
  }, [isInitialized, isLoggedIn, navigate]);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setSelectedMenuItem(path);
  }, [location]);

  useEffect(() => {
    const fetchActiveSubscriptions = async () => {
      if (selectedMenuItem !== 'packages') {
        setActiveSubscriptions([]);
        return;
      }

      setActiveLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/find-user-active-subscription-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch active subscriptions');
        const data = await response.json();
        setActiveSubscriptions(data.data || []);
        setActiveError(null);
      } catch (err) {
        setActiveError(err.message);
      } finally {
        setActiveLoading(false);
      }
    };

    const fetchExpiredSubscriptions = async () => {
      if (selectedMenuItem !== 'packages') {
        setExpiredSubscriptions([]);
        return;
      }

      setExpiredLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/find-user-expired-subscription-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch expired subscriptions');
        const data = await response.json();
        setExpiredSubscriptions(data.data || []);
        setExpiredError(null);
      } catch (err) {
        setExpiredError(err.message);
      } finally {
        setExpiredLoading(false);
      }
    };

    const fetchActiveBoosts = async () => {
      if (selectedMenuItem !== 'boost') {
        setActiveBoosts([]);
        return;
      }

      setActiveBoostLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/find-user-active-boost-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch active boosts');
        const data = await response.json();
        setActiveBoosts(data.data || []);
        setActiveBoostError(null);
      } catch (err) {
        setActiveBoostError(err.message);
      } finally {
        setActiveBoostLoading(false);
      }
    };

    const fetchExpiredBoosts = async () => {
      if (selectedMenuItem !== 'boost') {
        setExpiredBoosts([]);
        return;
      }

      setExpiredBoostLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/find-user-expired-boost-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch expired boosts');
        const data = await response.json();
        setExpiredBoosts(data.data || []);
        setExpiredBoostError(null);
      } catch (err) {
        setExpiredBoostError(err.message);
      } finally {
        setExpiredBoostLoading(false);
      }
    };

    const fetchActiveShowroomSubscriptions = async () => {
      if (selectedMenuItem !== 'showroom') {
        setActiveShowroomSubs([]);
        return;
      }

      setActiveShowroomLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/find-user-active-showroom-subscription-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch active showroom subscriptions');
        const data = await response.json();
        setActiveShowroomSubs(data.data || []);
        setActiveShowroomError(null);
      } catch (err) {
        setActiveShowroomError(err.message);
      } finally {
        setActiveShowroomLoading(false);
      }
    };

    const fetchExpiredShowroomSubscriptions = async () => {
      if (selectedMenuItem !== 'showroom') {
        setExpiredShowroomSubs([]);
        return;
      }

      setExpiredShowroomLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/find-user-expired-showroom-subscription-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch expired showroom subscriptions');
        const data = await response.json();
        setExpiredShowroomSubs(data.data || []);
        setExpiredShowroomError(null);
      } catch (err) {
        setExpiredShowroomError(err.message);
      } finally {
        setExpiredShowroomLoading(false);
      }
    };

    fetchActiveSubscriptions();
    fetchExpiredSubscriptions();
    fetchActiveBoosts();
    fetchExpiredBoosts();
    fetchActiveShowroomSubscriptions();
    fetchExpiredShowroomSubscriptions();
  }, [selectedMenuItem]);

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    navigate(`/packages-and-orders/${item}`);
  };

  const renderAdPackagesContent = () => {
    return (
      <Tabs 
        isFitted 
        index={selectedTab} 
        onChange={(index) => setSelectedTab(index)}
        variant="line"
        colorScheme="blue"
      >
        <TabList mb="1em">
          <Tab 
            fontWeight="semibold"
            _selected={{ 
              color: 'blue.500',
              borderBottomWidth: '3px'
            }}
          >
            ACTIVE
          </Tab>
          <Tab 
            fontWeight="semibold"
            _selected={{ 
              color: 'blue.500',
              borderBottomWidth: '3px'
            }}
          >
            EXPIRED
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {activeLoading ? (
              <Center height="64">
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : activeError ? (
              <Alert status="error">
                <AlertIcon />
                Error loading active subscriptions: {activeError}
              </Alert>
            ) : activeSubscriptions.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {activeSubscriptions.map((subscription, index) => (
  <SubscriptionCard 
  key={index} 
  {...subscription} 
  isBoost={false} 
/>                ))}
              </VStack>
            ) : (
              <EmptyState
                title="Nothing here..."
                description="You don't have any active ad packages"
              />
            )}
          </TabPanel>
          <TabPanel>
            {expiredLoading ? (
              <Center height="64">
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : expiredError ? (
              <Alert status="error">
                <AlertIcon />
                Error loading expired subscriptions: {expiredError}
              </Alert>
            ) : expiredSubscriptions.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {expiredSubscriptions.map((subscription, index) => (
                <SubscriptionCard 
                key={index} 
                {...subscription} 
                isBoost={false} 
                isExpired 
              />
                ))}
              </VStack>
            ) : (
              <EmptyState
                title="Nothing here..."
                description="You don't have any expired ad packages"
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  };

  const renderBoostPackagesContent = () => {
    return (
      <Tabs 
        isFitted
        variant="line"
        colorScheme="blue"
      >
        <TabList mb="1em">
          <Tab 
            fontWeight="semibold"
            _selected={{ 
              color: 'blue.500',
              borderBottomWidth: '3px'
            }}
          >
            ACTIVE
          </Tab>
          <Tab 
            fontWeight="semibold"
            _selected={{ 
              color: 'blue.500',
              borderBottomWidth: '3px'
            }}
          >
            EXPIRED
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {activeBoostLoading ? (
              <Center height="64">
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : activeBoostError ? (
              <Alert status="error">
                <AlertIcon />
                Error loading active boosts: {activeBoostError}
              </Alert>
            ) : activeBoosts.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {activeBoosts.map((boost, index) => (
                <SubscriptionCard 
                key={index} 
                {...boost} 
                isBoost={true} 
              />
                ))}
              </VStack>
            ) : (
              <EmptyState
                title="Nothing here..."
                description="You don't have any active boost packages"
              />
            )}
          </TabPanel>
          <TabPanel>
            {expiredBoostLoading ? (
              <Center height="64">
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : expiredBoostError ? (
              <Alert status="error">
                <AlertIcon />
                Error loading expired boosts: {expiredBoostError}
              </Alert>
            ) : expiredBoosts.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {expiredBoosts.map((boost, index) => (
                <SubscriptionCard 
                key={index} 
                {...boost} 
                isBoost={true} 
                isExpired 
              />
                ))}
              </VStack>
            ) : (
              <EmptyState
                title="Nothing here..."
                description="You don't have any expired boost packages"
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  };

  const renderShowroomContent = () => {
    return (
      <Tabs 
        isFitted 
        variant="line"
        colorScheme="blue"
      >
        <TabList mb="1em">
          <Tab 
            fontWeight="semibold"
            _selected={{ 
              color: 'blue.500',
              borderBottomWidth: '3px'
            }}
          >
            ACTIVE
          </Tab>
          <Tab 
            fontWeight="semibold"
            _selected={{ 
              color: 'blue.500',
              borderBottomWidth: '3px'
            }}
          >
            EXPIRED
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {activeShowroomLoading ? (
              <Center height="64">
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : activeShowroomError ? (
              <Alert status="error">
                <AlertIcon />
                Error loading active showroom subscriptions: {activeShowroomError}
              </Alert>
            ) : activeShowroomSubs.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {activeShowroomSubs.map((subscription, index) => (
                  <SubscriptionCard 
                    key={index} 
                    {...subscription} 
                    isShowroom={true} 
                  />
                ))}
              </VStack>
            ) : (
              <EmptyState
                title="Nothing here..."
                description="You don't have any active showroom subscriptions"
              />
            )}
          </TabPanel>
          <TabPanel>
            {expiredShowroomLoading ? (
              <Center height="64">
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : expiredShowroomError ? (
              <Alert status="error">
                <AlertIcon />
                Error loading expired showroom subscriptions: {expiredShowroomError}
              </Alert>
            ) : expiredShowroomSubs.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {expiredShowroomSubs.map((subscription, index) => (
                  <SubscriptionCard 
                    key={index} 
                    {...subscription} 
                    isShowroom={true} 
                    isExpired 
                  />
                ))}
              </VStack>
            ) : (
              <EmptyState
                title="Nothing here..."
                description="You don't have any expired showroom subscriptions"
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  };

  const renderContent = () => {
    if (selectedMenuItem === 'packages') {
      return renderAdPackagesContent();
    } else if (selectedMenuItem === 'boost') {
      return renderBoostPackagesContent();
    } else if (selectedMenuItem === 'showroom') {
      return renderShowroomContent();
    }
  };

  const renderMobileNav = () => {
    return (
      <Tabs 
        isFitted 
        mb={4} 
        variant="solid-rounded" 
        colorScheme="blue"
        bg="gray.100" 
        p={2} 
        borderRadius="lg"
      >
        <TabList gap={3}>
          <Tab
            fontWeight="semibold"
            onClick={() => handleMenuItemClick('packages')}
            isSelected={selectedMenuItem === 'packages'}
            _selected={{ 
              bg: 'blue.500', 
              color: 'white',
              boxShadow: 'md'
            }}
            borderRadius="md"
          >
            Ad Packages
          </Tab>
          <Tab
            fontWeight="semibold"
            onClick={() => handleMenuItemClick('boost')}
            isSelected={selectedMenuItem === 'boost'}
            _selected={{ 
              bg: 'blue.500', 
              color: 'white',
              boxShadow: 'md'
            }}
            borderRadius="md"
          >
            Boost Packages
          </Tab>
          <Tab
            fontWeight="semibold"
            onClick={() => handleMenuItemClick('showroom')}
            isSelected={selectedMenuItem === 'showroom'}
            _selected={{ 
              bg: 'blue.500', 
              color: 'white',
              boxShadow: 'md'
            }}
            borderRadius="md"
          >
            Showroom Subscription
          </Tab>
        </TabList>
      </Tabs>
    );
  };

  return (
    <Box maxWidth="container.xl" margin="auto" padding={8} className='min-h-screen'>
      {isMobile && renderMobileNav()}
      <Grid templateColumns={{ base: "1fr", md: "1fr 3fr" }} gap={6}>
        {!isMobile && (
          <GridItem>
            <VStack align="stretch" spacing={4} p={6}>
              <Text
                fontWeight="semibold"
                cursor="pointer"
                color={selectedMenuItem === 'packages' ? 'blue.500' : 'gray.700'}
                onClick={() => handleMenuItemClick('packages')}
                _hover={{ color: 'blue.400' }}
              >
                Ad Packages
              </Text>
              <Text
                fontWeight="semibold"
                cursor="pointer"
                color={selectedMenuItem === 'boost' ? 'blue.500' : 'gray.700'}
                onClick={() => handleMenuItemClick('boost')}
                _hover={{ color: 'blue.400' }}
              >
                Boost Packages
              </Text>
              <Text
                fontWeight="semibold"
                cursor="pointer"
                color={selectedMenuItem === 'showroom' ? 'blue.500' : 'gray.700'}
                onClick={() => handleMenuItemClick('showroom')}
                _hover={{ color: 'blue.400' }}
              >
                Showroom Subscription
              </Text>
            </VStack>
          </GridItem>
        )}
        <GridItem>
          {renderContent()}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PackagesAndOrders;