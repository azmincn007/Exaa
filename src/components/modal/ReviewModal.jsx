import { useState } from 'react';
import { Star } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { BASE_URL } from '../../config/config';

const RatingModal = ({ isOpen, onClose, showroomId }) => {
    
  const [selectedRating, setSelectedRating] = useState(3);
  const [hoveredRating, setHoveredRating] = useState(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  // Create mutation function
  const submitRating = async (data) => {
    const token = localStorage.getItem('UserToken');
    const response = await axios.post(
      `${BASE_URL}/api/ad-showroo-ratings`,
      {
        showroomId: data.showroomId,
        rating: data.rating
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  };

  // Use React Query mutation
  const mutation = useMutation(submitRating, {
    onSuccess: () => {
      toast({
        title: 'Rating submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries(['showroom', showroomId]);
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Failed to submit rating',
        description: error?.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const handleSubmit = () => {
    // Make sure we have a valid showroomId
    if (!showroomId) {
      toast({
        title: 'Error',
        description: 'Showroom ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    mutation.mutate({
      showroomId: showroomId,
      rating: selectedRating
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Very Unsatisfied",
      2: "Unsatisfied",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return texts[rating] || "";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="xl" fontWeight="bold" color="gray.800">
          Rate Your Showroom Experience
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody pb={6}>
          <VStack spacing={6}>
            <Flex justify="center" gap={2}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className="cursor-pointer"
                  onClick={() => handleStarClick(rating)}
                  onMouseEnter={() => handleStarHover(rating)}
                  onMouseLeave={handleMouseLeave}
                  color={(hoveredRating || selectedRating) >= rating ? '#FFB400' : '#E2E8F0'}
                  fill={(hoveredRating || selectedRating) >= rating ? '#FFB400' : 'none'}
                  style={{ width: '32px', height: '32px' }}
                />
              ))}
            </Flex>

            <Text color="gray.600" textAlign="center">
              {getRatingText(selectedRating)}
            </Text>

            <Button
              width="100%"
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={mutation.isLoading}
              loadingText="Submitting..."
            >
              Submit Rating
            </Button>

            <Text fontSize="sm" color="gray.600" textAlign="center" px={4}>
              Your rating helps us improve our showroom services and assists other
              customers in making informed decisions. Your feedback is valuable in
              maintaining our service quality.
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RatingModal;