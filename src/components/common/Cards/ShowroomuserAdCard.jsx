import React, { useState } from 'react';
import { Box, Image, Text, Flex, Badge, Icon, Grid, GridItem, useToast } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Eye, Heart, Calendar } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import DeleteConfirmationDialog from '../../modals/othermodals/DeleteConfirmation';
import { useQueryClient } from 'react-query';

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

const ShowroomuserAdCard = ({ data, onEdit, onDelete, showroomId,token  }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const formattedDate = formatDate(data.createdAt);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
   
    try {
        const subCategoryResponse = await axios.get(
            `${BASE_URL}/api/ad-find-one-sub-category/${data.adSubCategory.id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        const apiUrl = subCategoryResponse.data.data.apiUrl;

        // Optimistically update the UI
        queryClient.setQueryData(['showroomAds', showroomId], (oldData) => {
            return oldData ? oldData.filter(ad => ad.id !== data.id) : oldData;
        });

        await axios.delete(
            `${BASE_URL}/api/${apiUrl}/${data.id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        // Invalidate the query to refetch in the background
        queryClient.invalidateQueries(['showroomAds', showroomId]);

        if (onDelete) onDelete(data.id); // Notify parent about deletion
        toast({
            title: "Ad Deleted",
            description: "The ad has been successfully deleted.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    } catch (error) {
        console.error("Error deleting ad:", error);
        toast({
            title: "Error",
            description: "There was an error deleting the ad. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        // Optionally, you can revert the optimistic update here if needed
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    }
};
  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={1} mb={4} className='border-2 border-black'>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} className=''>
          <GridItem colSpan={3} position="relative">
            <Image src={`${BASE_URL}${data.images?.url}`} alt={data.title} objectFit="cover" w="100%" className='h-[200px]' />
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

          <GridItem colSpan={9} position="relative">
            <Flex justifyContent="flex-end" position="absolute" top="2" right="2">
              <ActionButton
                icon={FaPencilAlt}
                onClick={() => onEdit(data)}
                backgroundColor="#4B7294"
              />
              <Box width={2} />
              <ActionButton
                icon={FaTrash}
                onClick={handleDeleteClick}
                backgroundColor="red.500"
              />
            </Flex>

            <div>
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

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="Ad"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ShowroomuserAdCard;