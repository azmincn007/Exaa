import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = 'item',
  isLoading = false
}) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" textAlign="center">
            Delete {itemName}
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack spacing={4}>
              <Icon as={FaExclamationTriangle} w={12} h={12} color="red.500" />
              <Text fontSize="md" textAlign="center">
                Are you sure you want to delete this {itemName.toLowerCase()}? 
                This action cannot be undone.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter justifyContent="center">
            <Button ref={cancelRef} onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={onConfirm} 
              isLoading={isLoading}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;