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

const BoostGridBox = ({ boostTags,id }) => {
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  console.log(boostTags);
  

  // Mutation for creating initial order
  const createOrderMutation = useMutation(
    async (boostData) => {
      const token = localStorage.getItem('UserToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axios.post(
        `${BASE_URL}/api/create-ad-boost-order-id`,
        boostData,
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
  const completeBoostMutation = useMutation(
    async (boostData) => {
      const token = localStorage.getItem('UserToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axios.post(
        `${BASE_URL}/api/ad-boosts`,
        boostData,
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
          title: 'Boost Activated',
          description: 'Your boost has been successfully activated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate(-2);
      },
      onError: (error) => {
        toast({
          title: 'Boost Activation Failed',
          description: error.message || 'Failed to activate boost',
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
      const selectedBoostTag = boostTags.find(boost => boost.id === selectedBoost);
      const boostData = {
        orderId: orderData.id,
        amount: selectedBoostTag.amount,
        totalTagCount:selectedBoostTag.noOfTags.toString(),
        adBoostPackage: selectedBoostTag.id,
        paymentId: paymentId
      };

      await completeBoostMutation.mutateAsync(boostData);
      
    } catch (error) {
      console.error('Error completing boost setup:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete boost setup. Please contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Main function to handle boost purchase
  const handleBoost = async () => {
    if (!selectedBoost) return;

    try {
      setIsLoading(true);

      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 2. Create order using mutation
      const selectedBoostTag = boostTags.find(boost => boost.id === selectedBoost);
      console.log(selectedBoostTag);
      
      const orderData = await createOrderMutation.mutateAsync({
       
        amount: selectedBoostTag.amount
      });

      // 3. Configure Razorpay options
      const options = {
        key: 'rzp_test_dgIspPVd3h7OsH',
        amount: orderData.amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Boost Purchase',
        order_id: orderData.id,
        notes: {
          totalTagCount: selectedBoostTag.noOfTags.toString(),
          adBoostPackage: selectedBoostTag.id.toString(),
          userId:id
          
        },
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

  const handleBoostSelect = (boostId) => {
    setSelectedBoost(boostId === selectedBoost ? null : boostId);
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
        {boostTags.map((boost) => (
          <Box
            key={boost.id}
            borderWidth="1px"
            borderColor="#16273C"
            borderRadius="lg"
            p={4}
            textAlign="center"
            bg={selectedBoost === boost.id ? "blue.50" : "white"}
            cursor="pointer"
            onClick={() => handleBoostSelect(boost.id)}
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
              {boost.noOfTags} Tags
            </Text>
            <Text 
              color="green.500" 
              fontSize="lg" 
              fontWeight="semibold" 
              mb={4}
            >
              ₹{boost.amount}
            </Text>
            <Flex 
              justify="center" 
              align="center" 
              color="green.500" 
              fontSize="sm"
            >
              <CheckCircle size={16} />
              <Text ml={1}>Select Boost</Text>
            </Flex>
          </Box>
        ))}
      </Grid>

      {selectedBoost && (
        <Flex justify="center" mt={6}>
          <Button
            bg="#16273C"
            color="white"
            px={16}
            fontWeight="400"
            isLoading={isLoading || createOrderMutation.isLoading || completeBoostMutation.isLoading}
            loadingText="Processing..."
            _hover={{
              bg: "#233D5C"
            }}
            onClick={handleBoost}
          >
            Boost Now
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default BoostGridBox;