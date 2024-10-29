import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';

const TestModal = ({ isOpen, onClose, onSuccess, showToast }) => {
  const handleClose = () => {
    onClose();
    onSuccess();
    showToast();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Test Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Hi, it's test modal!
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TestModal;