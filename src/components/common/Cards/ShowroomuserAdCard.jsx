import React, { useState } from 'react';
import { Box, Image, Text, Flex, Icon, Grid, GridItem, useToast, useBreakpointValue } from '@chakra-ui/react';
import { Eye, Heart, Calendar } from 'lucide-react';
import { FaMapMarkerAlt, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { BASE_URL } from '../../../config/config';
import DeleteConfirmationDialog from '../../modals/othermodals/DeleteConfirmation';
import { useQueryClient } from 'react-query';
import AdBoostBadge from '../buttons/AdBoostBadge';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDescription = (description) => {
  if (!description) return 'No description available.';
  
  // Get first line and trim whitespace
  const firstLine = description.split('\n')[0].trim();
  
  // Check if there are multiple lines
  const hasMoreLines = description.includes('\n');
  
  // If text is longer than 100 chars or has more lines, truncate and add ellipsis
  if (firstLine.length > 100) {
    return `${firstLine.substring(0, 100)}...`;
  }
  
  // If there are more lines, add ellipsis even if first line is short
  return hasMoreLines ? `${firstLine}...` : firstLine;
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
  
  const toast = useToast();
  const queryClient = useQueryClient();  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(data);
    setIsDeleteDialogOpen(false);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Box className="border-2 border-black rounded-lg overflow-hidden p-1 mb-4">
        {isMobile ? (
          // Mobile view structure
          <Box>
            <Box position="relative">
              <Image 
                src={`${BASE_URL}${data?.images?.url}`} 
                alt={data?.title || 'Ad image'} 
                className="object-cover w-full h-[150px]" 
              />
              {data?.adBoostTag && (
                <Box className="absolute top-2 left-2">
                  <AdBoostBadge tag={data.adBoostTag} />
                </Box>
              )}
              <Flex className="absolute top-2 right-2 space-x-2">
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
            </Box>
            
            <Box p={2}>
              <Text className="font-bold text-xl">{data?.title}</Text>
              <Text className="text-md line-clamp-1">
                {formatDescription(data?.description)}
              </Text>
              <Text className="font-bold text-lg">{data?.price ? `₹${data.price.toLocaleString()}` : <Text color="green.500" fontSize="sm">Service</Text>}</Text>

              <Flex className="items-center space-x-4 my-2">
                <Flex className="items-center">
                  <Eye className="mr-2 w-4 h-4" />
                  <Text>{data?.adViewCount}</Text>
                </Flex>
                <Flex className="items-center">
                  <Heart className="mr-2 w-4 h-4" />
                  <Text>{data?.adFavouriteCount}</Text>
                </Flex>
              </Flex>

              <Flex justify="space-between" align="center">
                <Flex className="items-center">
                  <FaMapMarkerAlt className="mr-2 w-4 h-4" />
                  <Text>{data?.locationTown?.name}</Text>
                </Flex>
                <Flex className="items-center">
                  <Calendar className="mr-2 w-4 h-4" />
                  <Text>{formatDate(data?.createdAt)}</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        ) : (
          // Desktop view structure
          <Grid className="grid grid-cols-12 gap-4">
            <GridItem className="col-span-3 relative">
              <Image 
                src={`${BASE_URL}${data?.images?.url}`} 
                alt={data?.title || 'Ad image'} 
                className="object-cover w-full h-[200px]" 
              />
              {data?.adBoostTag && (
                <Box className="absolute top-2 left-2">
                  <AdBoostBadge tag={data.adBoostTag} />
                </Box>
              )}
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
                  <Text className="text-md line-clamp-1">
                    {formatDescription(data?.description)}
                  </Text>
                  <Text className="font-bold text-lg">{data?.price ? `₹${data.price.toLocaleString()}` : <Text color="green.500" fontSize="sm">Service</Text>}</Text>
                  
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
        )}
      </Box>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="Ad"
        isLoading={false}
      />
    </>
  );
};

export default ShowroomuserAdCard;
