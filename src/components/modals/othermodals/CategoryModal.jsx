import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Text,
  HStack,
  Grid,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const fetchCategories = async () => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/ad-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

function CategoryModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const { data: categories, isLoading: isLoadingCategories } = useQuery('categories', fetchCategories);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/category/${categoryId}/${categoryName}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', sm: 'md', md: '2xl' }} isCentered>
      <ModalOverlay />
      <ModalContent
        className="bg-white p-4 rounded-lg font-Inter"
        maxH={{ base: '80vh', sm: '70vh', md: 'auto' }}
        overflowY={{ base: 'auto', sm: 'unset', md: 'unset' }}
      >
        <ModalBody>
          <Box mb={4}>
            <Text fontSize={{ base: 'md', sm: 'lg' }} fontWeight="bold" color="gray.700">
              Select the Category
            </Text>
          </Box>
          {isLoadingCategories ? (
            <Spinner />
          ) : (
            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              gap={2}
              pb={4}
            >
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  justifyContent="flex-start"
                  fontSize={{ base: 'xs', sm: 'sm' }}
                  bg="white"
                  color="black"
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{
                    borderColor: "blue.500",
                    bg: "blue.100",
                    boxShadow: "sm",
                  }}
                  onClick={() => handleCategoryClick(category.id, category.name)}
                >
                  <HStack width="100%" justifyContent="space-between">
                    <Text>{category.name}</Text>
                    <FaChevronRight />
                  </HStack>
                </Button>
              ))}
            </Grid>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CategoryModal;