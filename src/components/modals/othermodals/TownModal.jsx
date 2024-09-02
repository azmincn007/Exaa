import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { IMAGES } from '../../../constants/logoimg';
import { BASE_URL } from '../../../config/config';
import { IoArrowBack } from 'react-icons/io5';
import { TownContext } from '../../../App';

const fetchTowns = async (districtId) => {
  const response = await axios.get(`${BASE_URL}/api/location-find-district-towns/${districtId}`);
  return response.data.data;
};

const updateUserLocation = async ({ districtId, townId }) => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.post(
    `${BASE_URL}/api/user-locations`,
    {
      locationDistrict: districtId,
      locationTown: townId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

function TownModal({ isOpen, onClose, districtId, districtName, onLocationSet }) {
  const [selectedTown, setSelectedTown] = useContext(TownContext);
  console.log(selectedTown);
  
  const toast = useToast();



  const { data: towns, isLoading, error } = useQuery(
    ['towns', districtId],
    () => fetchTowns(districtId),
    { enabled: !!districtId }
  );

  const updateLocationMutation = useMutation(updateUserLocation, {
    onSuccess: () => {
      toast({
        title: "Location updated",
        description: "Your location has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      onLocationSet();
    },
    onError: (error) => {
      toast({
        title: "Error updating location",
        description: error.message || "An error occurred while updating your location.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleTownSelect = (town) => {
    setSelectedTown(town.id);
    // Store the selected town ID in localStorage
    localStorage.setItem('selectedTownId', town.id);
    updateLocationMutation.mutate({ districtId, townId: town.id });
  };

  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset='slideInBottom'
      size={{ base: 'xs', md: 'md' }} 

    >
      <ModalOverlay />
      <ModalContent className="bg-white p-2 rounded-lg font-Inter">
        <ModalHeader className="flex items-center justify-center py-2">
          <img className="h-[25px] w-auto" src={IMAGES.ExaLogoBlack} alt="Exa Logo" />
        </ModalHeader>
        <Divider className="border-gray-300" />
        <ModalBody className="py-4 px-2">
        <div className="absolute left-4 cursor-pointer" onClick={onClose}>
            <IoArrowBack className="h-[30px] w-[30px]" />
          </div>
          <VStack spacing={3} align="stretch">
            <Heading as="h2" size="md" textAlign="center">
              Select Your Town
            </Heading>
            <Text textAlign="center" fontSize="sm" color="gray.600">
              Choose a town in {districtName}
            </Text>
            {isLoading && <Text textAlign="center" fontSize="sm">Loading towns...</Text>}
            {error && <Text textAlign="center" fontSize="sm" color="red.500">Error loading towns. Please try again.</Text>}
            {towns && (
              <Grid templateColumns="repeat(3, 1fr)" gap={2} width="100%">
                {towns.map((town) => (
                  <GridItem
                    key={town.id}
                    w="100%"
                    h="40px"
                    bg={selectedTown?.id === town.id ? "blue.500" : "white"}
                    color={selectedTown?.id === town.id ? "white" : "black"}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{
                      borderColor: "blue.500",
                      boxShadow: "sm",
                    }}
                    onClick={() => handleTownSelect(town)}
                  >
                    <Text fontSize="xs" textAlign="center">
                      {town.name}
                    </Text>
                  </GridItem>
                ))}
              </Grid>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter className="flex justify-end text-xs w-full mx-auto text-center opacity-60 py-2">
          {/* Add any footer content here */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TownModal;