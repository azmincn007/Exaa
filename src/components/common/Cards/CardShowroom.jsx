import React from 'react';
import { Box, Flex, Image, Text, Icon } from '@chakra-ui/react';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../config/config';

function CardShowroom({  imageUrl, price, title, location, postedDate, adBoostTag,  views, likes,id,adCategory }) {
  console.log(adCategory);
  
  
  
  const isActive = adBoostTag === "Active";

  return (
    <Link to={`/details/${id}/${adCategory}`}>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="md">
        <Flex>
          {/* Left side - Image */}
          <Box position="relative" width="40%" className='rounded-lg'>
            <Image src={imageUrl} alt={title} objectFit="cover" className='h-[200px] p-2 rounded-lg' h="100%" w="100%" />
            {isActive && (
              <Box position="absolute" top="2" left="2" bg="green.500" color="white" fontSize="xs" fontWeight="bold" px="2" py="1" borderRadius="full">
                Active
              </Box>
            )}
          </Box>

          {/* Right side - Content */}
          <Box width="60%" p="4">
            <Flex justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Text className='text-22' fontWeight="bold">{title}</Text>
                <Text text-16 fontWeight="bold" mt="2">₹{price.toLocaleString()}</Text>
              </Box>
              <Icon as={AiOutlineHeart} w={6} h={6} />
            </Flex>

            <Flex alignItems="center" mt="4" fontSize="sm" color="gray.500">
              <Icon as={AiOutlineEye} mr="1" />
              <Text mr="3">{views}</Text>
              <Icon as={AiOutlineHeart} mr="1" />
              <Text>{likes}</Text>
            </Flex>

            <Flex justifyContent="space-between" mt="2" fontSize="sm" color="gray.500">
              <Flex alignItems="center">
                <Icon as={IoLocationOutline} mr="1" />
                <Text>{location}</Text>
              </Flex>
              <Text>Posted On: {postedDate}</Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
}

export default CardShowroom;