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
import { FiLogOut } from 'react-icons/fi';

const LogoutConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
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
        <AlertDialogContent mx={4}>
          <AlertDialogHeader 
            fontSize="lg" 
            fontWeight="bold" 
            textAlign="center"
            pb={0}
          >
            <VStack spacing={4}>
              <Icon 
                as={FiLogOut} 
                w={12} 
                h={12} 
                color="red.500"
                p={2}
                bg="red.50"
                borderRadius="full"
              />
              <Text>Confirm Logout</Text>
            </VStack>
          </AlertDialogHeader>

          <AlertDialogBody textAlign="center" py={6}>
            <Text fontSize="md">
              Are you sure you want to logout?
            </Text>
            <Text fontSize="sm" color="gray.600" mt={2}>
              You'll need to login again to access your account.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter justifyContent="center">
            <Button
              ref={cancelRef}
              onClick={onClose}
              mr={3}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              isLoading={isLoading}
              loadingText="Logging out..."
            >
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default LogoutConfirmationModal;