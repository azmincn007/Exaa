import React from 'react';
import { 
  Box, 
  Image, 
  Text, 
  IconButton, 
  Flex,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { BASE_URL } from '../../../config/config';
import axios from 'axios';
import { useAuth } from '../../../Hooks/AuthContext';
import { useQueryClient } from 'react-query';

const ShowroomContentCard = ({ 
  showroom, 
  isSelected, 
  onClick,
  onEdit,
  onDeleteSuccess 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(showroom);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Optimistically update the UI
      const previousShowrooms = queryClient.getQueryData(["showrooms"]);
      
      // Optimistically remove the showroom from the cache
      queryClient.setQueryData(["showrooms"], (old) => 
        old?.filter((s) => s.id !== showroom.id)
      );

      const response = await axios.delete(
        `${BASE_URL}/api/ad-showrooms/${showroom.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Call the success callback with the showroom id
        onDeleteSuccess(showroom.id);
        
        // Invalidate the query to ensure consistency
        await queryClient.invalidateQueries({
          queryKey: ["showrooms"],
          refetchType: 'active',
          exact: true
        });
      }
    } catch (error) {
      // Revert the optimistic update on error
      queryClient.setQueryData(["showrooms"], previousShowrooms);
      
      toast({
        title: "Error deleting showroom",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Box
        borderRadius="xl"
        overflow="hidden"
        bg={isSelected ? "#4F7598" : "#23496C"}
        color="white"
        className="p-4"
        height="100%"
        cursor="pointer"
        onClick={() => onClick(showroom)}
        transition="all 0.2s"
        _hover={{ transform: 'scale(1.02)' }}
        position="relative"
      >
        {/* Action Buttons Container */}
        <Flex
          position="absolute"
          top={6}
          right={6}
          gap={2}
          zIndex={2}
        >
          <IconButton
            icon={<FaPencilAlt />}
            aria-label="Edit showroom"
            size="sm"
            colorScheme="blue"
            bg="#4F7598"
            _hover={{ bg: '#3182CE' }}
            onClick={handleEdit}
            borderRadius="full"
            className="opacity-90 hover:opacity-100"
          />
          <IconButton
            icon={<FaTrash />}
            aria-label="Delete showroom"
            size="sm"
            colorScheme="red"
            bg="red.500"
            _hover={{ bg: 'red.600' }}
            onClick={handleDeleteClick}
            borderRadius="full"
            className="opacity-90 hover:opacity-100"
          />
        </Flex>

        {/* Card Content */}
        <Box position="relative">
          <Image
            src={`${BASE_URL}${showroom.images?.url}`}
            alt={showroom.name}
            objectFit="cover"
            height="100px"
            width="100%"
            bg="black"
            className="rounded-xl"
          />
          
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            height="100px" 
            background="linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)"
            className="rounded-xl"
          />
        </Box>

        <Box p={2}>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {showroom.name}
          </Text>
          <Text fontSize="sm">Category: {showroom.adCategory?.name}</Text>
          <Text fontSize="sm">
            Created On: {new Date(showroom.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Showroom
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this showroom? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ShowroomContentCard;