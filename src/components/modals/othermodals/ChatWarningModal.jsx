import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Button,
    VStack,
    Text,
    HStack,
    Box,
    useDisclosure,
    Flex
  } from '@chakra-ui/react';
  import { AlertTriangle, MessageSquare, CreditCard, Ban, AlertOctagon, X } from 'lucide-react';
  
  const SafetyTip = ({ icon: Icon, text }) => (
    <Box
      p={2.5}
      bg="blue.50"
      borderRadius="md"
      transition="all 0.2s"
      _hover={{ bg: 'blue.100' }}
      border="1px solid"
      borderColor="blue.100"
      width="100%"
    >
      <HStack spacing={3} align="flex-start">
        <Box color="blue.500" mt={0.5}>
          <Icon size={16} />
        </Box>
        <Text color="gray.700" fontSize="xs" lineHeight="1.4">
          {text}
        </Text>
      </HStack>
    </Box>
  );
  
  export default function ChatWarningModal({ isOpen, onClose, phoneNumber }) {
    const safetyTips = [
      {
        icon: MessageSquare,
        text: "Be safe, meet in public places when dealing with buyers/sellers"
      },
      {
        icon: CreditCard,
        text: "Never share UPI PIN or OTP while receiving payments"
      },
      {
        icon: Ban,
        text: "Avoid advance payments before product inspection"
      },
      {
        icon: AlertOctagon,
        text: "Report suspicious behavior immediately"
      }
    ];
  
    const handleCall = () => {
      window.location.href = `tel:${phoneNumber}`;
      onClose();
    };
  
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        isCentered 
        size="sm"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent 
          borderRadius="lg" 
          mx={4} 
          overflow="auto"
        >
          <Box position="absolute" top={2} right={2} zIndex={1}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              p={1}
              minW="auto"
              h="auto"
              _hover={{ bg: 'gray.100' }}
            >
              <X size={18} />
            </Button>
          </Box>
          <ModalBody p={4}>
            <VStack spacing={4} align="stretch">
              {/* Warning Icon */}
              <Flex
                justify="center"
                align="center"
                w="12"
                h="12"
                borderRadius="full"
                bg="blue.50"
                mx="auto"
              >
                <AlertTriangle size={24} color="var(--chakra-colors-blue-500)" />
              </Flex>
  
              {/* Title */}
              <VStack spacing={1}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  textAlign="center"
                  color="gray.800"
                >
                  Tips for a safe deal
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  textAlign="center"
                >
                  Review before proceeding
                </Text>
              </VStack>
  
              {/* Safety Tips */}
              <VStack spacing={2}>
                {safetyTips.map((tip, index) => (
                  <SafetyTip key={index} {...tip} />
                ))}
              </VStack>
  
              {/* Action Buttons */}
              <VStack spacing={2} pt={1}>
                <Button
                  w="100%"
                  size="sm"
                  colorScheme="blue"
                  onClick={handleCall}
                  _hover={{ transform: 'translateY(-1px)' }}
                  transition="all 0.2s"
                  mb={2}
                >
                  Continue to call
                </Button>
              
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }