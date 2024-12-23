import { useContext, useState } from 'react'
import { Check } from 'lucide-react'
import { Box, Button, Heading, Text, VStack, HStack, Badge, List, ListItem, Grid, Card, CardBody, Skeleton } from '@chakra-ui/react'
import { useQuery, useMutation } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../config/config'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { UserdataContext } from '../../App'

const packageFeatures = [
  "Increase your ad limit beyond the standard 10 ads",
  "Access to boost tags for improved visibility",
  "Long-term savings with multi-year subscriptions"
]

export default function ShowroomSubscriptionPage() {

    const location = useLocation();
    const { name, id } = location.state || {};
    const navigate = useNavigate();
    const toast = useToast();
    const { userData } = useContext(UserdataContext);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedShowroom, setSelectedShowroom] = useState(name)
    

    // Fetch subscription data from the API with bearer token
    const { data: subscriptionData = [], isLoading: subscriptionLoading, isError } = useQuery('subscriptionTiers', () => {
      const userToken = localStorage.getItem('UserToken'); // Retrieve token from local storage
      return fetch(`${BASE_URL}/api/ad-show-subs-packs`, {
        headers: {
          Authorization: `Bearer ${userToken}` // Pass the token in the Authorization header
        }
      }).then(res => res.json()).then(data => {
        return data.data; // Return the data for useQuery
      });
    });

    // Fetch active packages from the API
    const { data: activePackages = [], isLoading: activePackagesLoading, isError: activePackagesError } = useQuery(['activePackages', id], () => {
      const userToken = localStorage.getItem('UserToken'); // Retrieve token from local storage
      return fetch(`${BASE_URL}/api/find-user-active-showroom-subscription-orders/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}` // Pass the token in the Authorization header
        }
      }).then(res => res.json()).then(data => {
        console.log(data.data);
        return data.data; // Return the data for useQuery
      });
    });

    // Add mutations for order creation and completion
    const createOrderMutation = useMutation(
      async (subscriptionData) => {
        const token = localStorage.getItem('UserToken');
        if (!token) throw new Error('User not authenticated');

        const response = await axios.post(
          `${BASE_URL}/api/create-ad-showroom-subscription-order-id`,
          subscriptionData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log(response.data.data);
        
        return response.data.data;
      }
    );

    const completeSubscriptionMutation = useMutation(
      async (subscriptionData) => {
        const token = localStorage.getItem('UserToken');
        if (!token) throw new Error('User not authenticated');

        const response = await axios.post(
          `${BASE_URL}/api/ad-showroo-subscris`,
          subscriptionData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        return response.data;
      },
      {
        onSuccess: () => {
          toast({
            title: 'Subscription Activated',
            description: 'Your subscription has been successfully activated',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          navigate(-1);
        },
        onError: (error) => {
          toast({
            title: 'Subscription Activation Failed',
            description: error.message || 'Failed to activate subscription',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    );

    // Add helper functions for Razorpay
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const handlePaymentSuccess = async (paymentId, orderId, orderData, tier) => {
      try {
        const subscriptionData = {
          orderId: orderData.id,
          amount: tier.amount,
          totalAdCount: tier.adLimit,
          adShowroomSubscriptionPackage: tier.id,
          paymentId: paymentId,
          showroomId: id,
          userId: userData?.id
        };

        await completeSubscriptionMutation.mutateAsync(subscriptionData);
      } catch (error) {
        console.error('Error completing subscription:', error);
        toast({
          title: 'Error',
          description: 'Failed to complete subscription setup.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleSubscription = async (tier) => {
      try {
        setIsLoading(true);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load');
        }

        const orderData = await createOrderMutation.mutateAsync({
          amount: tier.amount
        });
        console.log(orderData);
        
        const options = {
          key: 'rzp_test_dgIspPVd3h7OsH',
          amount: orderData.amount,
          currency: 'INR',
          name: 'Your Company Name',
          description: `${tier.name} Subscription`,
          order_id: orderData.id,
          notes: {
            adShowroomSubscriptionPackage: tier.id.toString(),
            showroomId: id,
            totalAdCount: tier.adLimit,
            userId: userData?.id,
          },
          handler: function(response) {
            handlePaymentSuccess(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              orderData,
              tier
            );
          },
          prefill: {
            name: 'Your Name',
            email: 'email@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3182CE',
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false);
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (error) {
        setIsLoading(false);
        toast({
          title: 'Error',
          description: error.message === 'User not authenticated' 
            ? 'Please log in to continue.' 
            : 'Failed to process payment. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    return (
      <Box className="container mx-auto px-4 py-8 font-Inter">
        <Heading className='font-Inter' as="h1" size={{ base: "md", md: "xl" }} mb={6} textAlign="center" color="black">Showroom Subscription</Heading>
        
        <VStack mb={8} textAlign="center">
          <Heading className='font-Inter' as="h2" size={{ base: "md", md: "lg" }} color="#3182CE">{selectedShowroom}</Heading>
        </VStack>

        {/* Active Packages Section */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Active Packages</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 font-Inter">
          {activePackagesLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton 
                key={index} 
                height="150px" 
                borderRadius="lg" 
                startColor="gray.100" 
                endColor="gray.200" 
                isLoaded={!activePackagesLoading}
                fadeDuration={0.5}
              />
            ))
          ) : activePackagesError ? (
            <Text>Error loading active packages.</Text>
          ) : activePackages.length === 0 ? (
            <Card className="border-2 border-blue-200 col-span-full">
              <CardBody className="p-6 text-center">
                <Text className="text-lg text-gray-600 mb-2">No Active Packages Found</Text>
                <Text className="text-sm text-gray-500">
                  Purchase a subscription package to increase your showroom's visibility and post more ads.
                </Text>
              </CardBody>
            </Card>
          ) : (
            activePackages.map((pkg) => (
              <Card key={pkg.id} className="border-2 border-blue-200">
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{pkg.adShowSubsPack?.name}</h4>
                      <p className="text-sm text-muted-foreground">{pkg.adsLimit}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Remaining Ads</span>
                      <span>{pkg.remainingAdCount} / {pkg.totalAdCount}</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(pkg.remainingAdCount / pkg.totalAdCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valid until: {new Date(pkg.transactionExpiryTime).toLocaleDateString()}
                  </p>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>


        <Box mb={8}>
          <div className='flex justify-center items-center'>
                    <Text className='font-Inter' color="black" mt={2}>Choose a subscription package for your showroom</Text>
          </div>

          <Heading as="h2" size={{ base: "md", md: "lg" }} mb={4} color="#3182CE">Package Features</Heading>
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
            {packageFeatures.map((feature, index) => (
              <Box key={index} display="flex" alignItems="center" bg="blue.50" p={3} borderRadius="md">
                <Check className="h-5 w-5 text-[#3182CE] flex-shrink-0" />
                <Text ml={2} fontSize="sm" color="gray.700">{feature}</Text>
              </Box>
            ))}
          </Grid>
        </Box>

        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
          {subscriptionLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton 
                key={index} 
                height="200px" 
                borderRadius="lg" 
                startColor="gray.100" 
                endColor="gray.200" 
                isLoaded={!subscriptionLoading} // Control loading state
                fadeDuration={0.5} // Optional: control fade duration
              />
            ))
          ) : isError ? (
            <Text>Error loading subscription data.</Text>
          ) : (
            subscriptionData.map((tier) => (
              <Box key={tier.id} borderWidth={1} borderColor="#3182CE" borderRadius="lg" overflow="hidden" boxShadow="md" transition="0.3s" _hover={{ boxShadow: "lg" }} display="flex" flexDirection="column">
                <Box bg="blue.50" p={4} flex="1">
                  <Heading as="h3" size="md" textAlign="center" color="#3182CE">
                    {tier.name}
                  </Heading>
                  <Badge colorScheme="blue" mt={2} display="block" textAlign="center">
                    Up to {tier.adLimit} ads
                  </Badge>
                </Box>
                <Box p={4} flex="1">
                  <List spacing={2}>
                    {[
                      `Post up to ${tier.adLimit} ads`,
                      "Boost tags included"
                    ].map((feature, idx) => (
                      <ListItem key={idx} display="flex" alignItems="center">
                        <Check className="h-5 w-5 text-[#3182CE] mr-2 flex-shrink-0" />
                        <Text fontSize="sm" color="black">{feature}</Text>
                      </ListItem>
                    ))}
                  </List>
                  <VStack mt={4} spacing={4} textAlign="center" borderTopWidth={1} borderColor="gray.200" pt={4}>
                    <Text fontSize="3xl" fontWeight="bold" color="#3182CE">
                      ₹{tier.amount.toLocaleString()}
                    </Text>
                    <Button 
                      colorScheme="blue" 
                      width="full"
                      isLoading={isLoading}
                      onClick={() => handleSubscription(tier)}
                    >
                      Select Plan
                    </Button>
                  </VStack>
                </Box>
              </Box>
            ))
          )}
        </Grid>
      </Box>
    )
}

