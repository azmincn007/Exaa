import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Text,
  HStack,
  Grid,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { FaChevronRight } from 'react-icons/fa';

const fetchSubcategories = async (categoryId) => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/ad-find-category-sub-categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

function CategoryModal({ isOpen, onClose, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: subcategories, isLoading: isLoadingSubcategories } = useQuery(
    ['subcategories', selectedCategory],
    () => fetchSubcategories(selectedCategory),
    {
      enabled: !!selectedCategory,
    }
  );

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text mb={4}>Select a category to see the available subcategories.</Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            {selectedCategory === null ? (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <HStack width="100%" justifyContent="space-between">
                    <Text>{category.name}</Text>
                    <FaChevronRight />
                  </HStack>
                </Button>
              ))
            ) : (
              <>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  <HStack>
                    <BiLeftArrowAlt />
                    <Text>Back</Text>
                  </HStack>
                </Button>
                <VStack align="stretch" gridColumn="span 2">
                  {isLoadingSubcategories ? (
                    <Spinner />
                  ) : (
                    subcategories?.map((subcategory, index) => (
                      <Button key={index} variant="ghost" justifyContent="flex-start">
                        {subcategory.name}
                      </Button>
                    ))
                  )}
                </VStack>
              </>
            )}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CategoryModal;