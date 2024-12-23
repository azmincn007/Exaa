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

const ShowroomGridBox = ({ ShowroomPackages, id }) => {
  const [selectedBoost, setSelectedBoost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  console.log(ShowroomPackages);
  

  const handleBoost = () => {
    if (!selectedBoost) return;
    navigate('/my-showroom');
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
        {ShowroomPackages?.map((boost) => (
          <Box
          className='font-Inter'
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
            className='font-Inter'
              fontSize="sm"
              fontWeight="bold" 
              mb={2}
            >
              {boost.name}
            </Text>
            <Text 
              fontSize="sm"
              color="gray.600"
              mb={2}
            >
              Up to {boost.adLimit} ads
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
              <Text ml={1}>
                Select Subscription
              </Text>
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
            isLoading={isLoading}
            loadingText="Processing..."
            _hover={{
              bg: "#233D5C"
            }}
            onClick={handleBoost}
          >
            Go to My Showroom
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default ShowroomGridBox;