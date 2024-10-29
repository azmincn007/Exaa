import React, { useState } from 'react';
import { Box, Image, Text, Flex, Badge, Icon, Grid, GridItem, useToast } from '@chakra-ui/react';
import { Eye, Heart, Calendar } from 'lucide-react';
import { FaMapMarkerAlt, FaPencilAlt, FaTrash } from 'react-icons/fa';
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
    className={`p-2 rounded-md text-white ${backgroundColor === "red.500" ? "bg-red-500" : "bg-blue-600"}`}
    onClick={onClick}
  >
    <Icon className="w-4 h-4" />
  </Box>
);

const ShowroomuserAdCard = ({ data, onEdit, onDelete, showroomId, token }) => {
  const toast = useToast();  // Added Chakra UI toast
  const queryClient = useQueryClient();  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!data?.id || !data?.adSubCategory?.id) {
      console.error("Invalid ad data:", data);
   
      return;
    }

    setIsDeleting(true);
   
    try {
      // Get the sub-category details first
      const subCategoryResponse = await fetch(
        `${BASE_URL}/api/ad-find-one-sub-category/${data.adSubCategory.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!subCategoryResponse.ok) {
        throw new Error('Failed to fetch sub-category');
      }

      const subCategoryData = await subCategoryResponse.json();
      const apiUrl = subCategoryData.data.apiUrl;

      // Optimistically update the UI with proper type checking
      queryClient.setQueryData(['showroomAds', showroomId], (oldData) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.filter(ad => ad?.id !== data.id);
      });

      // Delete the ad
      const deleteResponse = await fetch(
        `${BASE_URL}/api/${apiUrl}/${data.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete ad');
      }

      // Invalidate the query to refetch in the background
      queryClient.invalidateQueries(['showroomAds', showroomId]);

      if (onDelete) onDelete(data.id);
      
     
    } catch (error) {
      console.error("Error deleting ad:", error);
      
      // Revert the optimistic update
      queryClient.invalidateQueries(['showroomAds', showroomId]);
      
     
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Box className="border-2 border-black rounded-lg overflow-hidden p-1 mb-4">
        <Grid className="grid grid-cols-12 gap-4">
          <GridItem className="col-span-3 relative">
            <Image 
              src={`${BASE_URL}${data?.images?.url}`} 
              alt={data?.title || 'Ad image'} 
              className="object-cover w-full h-[200px]" 
            />
            <Badge className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded">
              Active
            </Badge>
          </GridItem>

          <GridItem className="col-span-9 relative">
            <Flex className="justify-end absolute top-2 right-2 space-x-2">
              <ActionButton
                icon={FaPencilAlt}
                onClick={() => onEdit(data)}
                backgroundColor="#4B7294"
              />
              <ActionButton
                icon={FaTrash}
                onClick={handleDeleteClick}
                backgroundColor="red.500"
              />
            </Flex>

            <div>
              <Box className="space-y-2">
                <Text className="font-bold text-xl">{data?.title}</Text>
                <Text className="text-md">{`${data?.description} KM`}</Text>
                <Text className="font-bold text-lg">₹{data?.price?.toLocaleString()}</Text>
                
                <Flex className="items-center space-x-4">
                  <Flex className="items-center">
                    <Eye className="mr-2 w-4 h-4" />
                    <Text>{data?.adViewCount}</Text>
                  </Flex>
                  <Flex className="items-center">
                    <Heart className="mr-2 w-4 h-4" />
                    <Text>{data?.adFavouriteCount}</Text>
                  </Flex>
                </Flex>

                <Flex className="justify-between">
                  <Flex className="items-center">
                    <FaMapMarkerAlt className="mr-2 w-4 h-4" />
                    <Text>{data?.locationTown?.name}</Text>
                  </Flex>
                  <Flex className="items-center">
                    <Calendar className="mr-2 w-4 h-4" />
                    <Text>Posted on: {formatDate(data?.createdAt)}</Text>
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