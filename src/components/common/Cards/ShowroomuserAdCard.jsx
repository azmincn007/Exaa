import React from 'react';
import { Box, Image, Text, Flex, Badge, Icon, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPencilAlt } from 'react-icons/fa';
import { Eye, Heart, Calendar } from 'lucide-react';
import { BASE_URL } from '../../../config/config';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const CarListingCard = ({ data }) => {
  const formattedDate = formatDate(data.createdAt);

  return (
    <Box borderWidth="2px" borderRadius="lg" borderColor="black" overflow="hidden" position="relative" className='font-Inter'>
      <Grid templateColumns="repeat(12, 1fr)" className='max-h-[250px] bg-[#0071BC1A]'>
        <GridItem colSpan={4} position="relative" className='p-2'>
          <Box height="200px" display="flex" alignItems="center" justifyContent="center">
            <Image
              src={`${BASE_URL}${data.images?.url}`}
              alt={data.title}
              objectFit="cover"
              maxHeight="100%"
              width="100%"
              className='rounded-lg'
            />
          </Box>
          <Badge
            className='bg-[#06B706] text-white rounded-sm text-[10px] font-[400]'
            position="absolute"
            top={4}
            left={4}
            zIndex={1}
          >
            Active
          </Badge>
        </GridItem>
        
        <GridItem colSpan={8} p={4}>
          <Text fontWeight="semibold" fontSize="lg" mb={2}>{data.title}</Text>
          <Text fontSize="sm" color="gray.600" mb={2}>{`${data.description} KM`}</Text>
          <Text fontWeight="bold" fontSize="sm" mb={4}>₹{data.price.toLocaleString()}</Text>
          
          <Flex gap={4} mb={4} alignItems="center">
            <Flex alignItems="center">
              <Eye className="mr-1" />
              <Text fontSize="sm">{data.adViewCount}</Text>
            </Flex>
            
            <Box className='w-[1px] h-[15px] bg-black' />
            
            <Flex alignItems="center">
              <Heart className="mr-1" />
              <Text fontSize="sm">{data.adFavouriteCount}</Text>
            </Flex>
          </Flex>
          
          <Flex className='justify-between'>
            <Flex alignItems="center">
              <Icon as={FaMapMarkerAlt} mr={1} />
              <Text fontSize="sm">{data.locationTown?.name}</Text>
            </Flex>
            
            <Flex alignItems="center">
             
              <Text fontSize="sm" >Posted on: {formattedDate}</Text>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      
      <IconButton
        icon={<FaPencilAlt className='text-white'/>}
        aria-label="Edit"
        size="sm"
        position="absolute"
        top={2}
        right={2}
        className='bg-[#4B7294] rounded-full'
      />
    </Box>
  );
};

export default CarListingCard;