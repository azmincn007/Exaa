import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Flex, Button } from '@chakra-ui/react';
import { Smartphone } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems="center" gap={2} color="#0071BC">
            <Smartphone size={24} />
            <Text>Mobile App Access</Text>
          </Flex>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody className="font-Inter pb-8">
          <Text textAlign="center" fontSize="sm" color="gray.500" pb={4}>
            Contact numbers are available in our mobile app
          </Text>
          <Text textAlign="center" fontSize="sm" color="gray.500" pb={6}>
            Get instant access to all contact numbers by installing our user-friendly mobile application. Manage your contacts with ease, anytime, anywhere.
          </Text>
          <Button colorScheme="blue" variant="solid" w="full">
            Install App Now
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}