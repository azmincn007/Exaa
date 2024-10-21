import React, { useState } from 'react';
import { 
  Grid, 
  Box, 
  Text, 
  Flex, 
  Button,
  useToast
} from '@chakra-ui/react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';

const PackageGrid = ({ packages, fromBoost }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Mutation for creating initial order
  const createOrderMutation = useMutation(
    async (packageData) => {
      const token = localStorage.getItem('UserToken');
      if (!token) throw new Error('User not authenticated');

      const endpoint = fromBoost 
        ? `${BASE_URL}/api/create-ad-boost-order-id`
        : `${BASE_URL}/api/create-ad-subscription-order-id`;

      const response = await axios.post(
        endpoint,
        packageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    }
  );

  // Mutation for post-payment API call
  const completePackageMutation = useMutation(
    async (packageData) => {
      const token = localStorage.getItem('UserToken');
      if (!token) throw new Error('User not authenticated');

      const endpoint = fromBoost
        ? `${BASE_URL}/api/ad-boosts`
        : `${BASE_URL}/api/ad-subscriptions`;

      const response = await axios.post(
        endpoint,
        packageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        toast({
          title: fromBoost ? 'Boost Activated' : 'Subscription Activated',
          description: fromBoost 
            ? 'Your boost package has been successfully activated'
            : 'Your subscription has been successfully activated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-2);
      },
      onError: (error) => {
        toast({
          title: fromBoost ? 'Boost Activation Failed' : 'Subscription Activation Failed',
          description: error.message || 'Failed to activate package',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  );

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Function to handle payment success
  const handlePaymentSuccess = async (paymentId, orderId, orderData) => {
    console.log('Payment successful:', paymentId, orderId);
    
    try {
      // Prepare data based on package type
      const packageData = fromBoost ? {
        orderId: orderData.id,
        amount: orderData.amount,
        totalTagCount: '10',
        adBoostPackage: 1,
        paymentId: paymentId
      } : {
        orderId: orderData.id,
        amount: orderData.amount,
        totalAdCount: '10',
        adSubscriptionPackage: 1,
        paymentId: paymentId
      };

      // Call the appropriate API
      await completePackageMutation.mutateAsync(packageData);
      
    } catch (error) {
      console.error('Error completing package setup:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete package setup. Please contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Main function to handle subscription/boost
  const handleSubscribe = async () => {
    if (!selectedPackage) return;

    try {
      setIsLoading(true);

      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 2. Create order using mutation
      const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
      const orderData = await createOrderMutation.mutateAsync({
        packageId: selectedPackage,
        amount: selectedPkg.amount
      });

      // 3. Configure Razorpay options
      const options = {
        key: 'rzp_test_dgIspPVd3h7OsH',
        amount: orderData.amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: fromBoost ? 'Boost Package' : 'Package Subscription',
        order_id: orderData.orderId,
        handler: function(response) {
          handlePaymentSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            orderData
          );
        },
        prefill: {
          name: 'Your Name',
          email: 'email@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#16273C',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            navigate(-2);
          }
        }
      };

      // 4. Initialize and open Razorpay
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

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId === selectedPackage ? null : packageId);
  };

  return (
    <Box className='font-Inter'>
      <Grid 
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)"
        }}
        gap={6}
      >
        {packages.map((pkg) => (
          <Box
            key={pkg.id}
            borderWidth="1px"
            borderColor="#16273C"
            borderRadius="lg"
            p={4}
            textAlign="center"
            bg={selectedPackage === pkg.id ? "blue.50" : "white"}
            cursor="pointer"
            onClick={() => handlePackageSelect(pkg.id)}
            transition="all 0.2s"
            _hover={{ 
              boxShadow: 'md',
              transform: 'translateY(-2px)'
            }}
          >
            <Text 
              fontSize="sm"
              fontWeight="bold" 
              mb={2}
            >
              {fromBoost ? pkg.noOfTags : pkg.noOfAds} {fromBoost ? 'Tags' : 'Ads'}
            </Text>
            <Text 
              color="green.500" 
              fontSize="lg" 
              fontWeight="semibold" 
              mb={4}
            >
              ₹{pkg.amount}
            </Text>
            <Flex 
              justify="center" 
              align="center" 
              color="green.500" 
              fontSize="sm"
            >
              <CheckCircle size={16} />
              <Text ml={1}>Select Package</Text>
            </Flex>
          </Box>
        ))}
      </Grid>

      {selectedPackage && (
        <Flex justify="center" mt={6}>
          <Button
            bg="#16273C"
            color="white"
            px={16}
            fontWeight="400"
            isLoading={isLoading || createOrderMutation.isLoading || completePackageMutation.isLoading}
            loadingText="Processing..."
            _hover={{
              bg: "#233D5C"
            }}
            onClick={handleSubscribe}
          >
            {fromBoost ? 'Boost Now' : 'Subscribe Now'}
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default PackageGrid;