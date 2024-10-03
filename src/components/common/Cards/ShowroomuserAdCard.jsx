import React from 'react';
import { Box, Image, Text, Flex, Badge, Icon, Grid, GridItem, useToast } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Eye, Heart, Calendar } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ActionButton = ({ icon: Icon, onClick, backgroundColor }) => (
  <Box
    as="button"
    p={2}
    borderRadius="md"
    bg={backgroundColor}
    color="white"
    onClick={onClick}
  >
    <Icon />
  </Box>
);

const ShowroomuserAdCard = ({ data, onEdit, onDelete }) => {
  const toast = useToast();
  const formattedDate = formatDate(data.createdAt);

  const handleDelete = async () => {
    const token = localStorage.getItem('UserToken');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to delete an ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const subCategoryResponse = await axios.get(
        `${BASE_URL}/api/ad-find-one-sub-category/${data.adSubCategory.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const apiUrl = subCategoryResponse.data.data.apiUrl;

      await axios.delete(
        `${BASE_URL}/api/${apiUrl}/${data.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast({
        title: "Ad Deleted",
        description: "The ad has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onDelete) onDelete(data.id);

    } catch (error) {
      console.error("Error deleting ad:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the ad. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={1} mb={4} className='border-2 border-black'>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} className=''>
        <GridItem colSpan={3} position="relative">
          <Image src={`${BASE_URL}${data.images?.url}`} alt={data.title} objectFit="cover" w="100%" h="100%" />
          <Badge 
            position="absolute" 
            top="2" 
            left="2" 
            colorScheme="green"
            p={1} 
            borderRadius="md"
          >
            Active
          </Badge>
        </GridItem>

        {/* Content Section */}
        <GridItem colSpan={9} position="relative">
          {/* Top right icons for Edit and Delete */}
          <Flex justifyContent="flex-end" position="absolute" top="2" right="2">
            <ActionButton
              icon={FaPencilAlt}
              onClick={() => onEdit(data)}
              backgroundColor="#4B7294"
            />
            <Box width={2} />
            <ActionButton
              icon={FaTrash}
              onClick={handleDelete}
              backgroundColor="red.500"
            />
          </Flex>

          {/* Content Area */}
          <div >
            <Box>
              <Text fontWeight="bold" fontSize="xl" mb={2}>{data.title}</Text>
              <Text fontSize="md" mb={2}>{`${data.description} KM`}</Text>
              <Text fontWeight="bold" fontSize="lg" mb={2}>₹{data.price.toLocaleString()}</Text>
              <Flex alignItems="center" mb={2}>
                <Icon as={Eye} mr={2} />
                <Text mr={4}>{data.adViewCount}</Text>
                <Icon as={Heart} mr={2} />
                <Text>{data.adFavouriteCount}</Text>
              </Flex>

               {/* Location and Posted Date Flex */}
            <Flex justifyContent="space-between" >
              <Flex alignItems="center">
                <Icon as={FaMapMarkerAlt} mr={2} />
                <Text>{data.locationTown?.name}</Text>
              </Flex>
              <Flex alignItems="center">
                <Icon as={Calendar} mr={2} />
                <Text>Posted on: {formattedDate}</Text>
              </Flex>
            </Flex>
            </Box>

           
          </div>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ShowroomuserAdCard;
