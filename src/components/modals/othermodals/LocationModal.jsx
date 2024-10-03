import React, { useState, useContext } from 'react';
import { useQuery } from 'react-query';
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
import TownModal from './TownModal';
import { TownContext } from '../../../App';
import { DistrictContext } from '../../../App';

const fetchLocationDistricts = async () => {
  const response = await axios.get(`${BASE_URL}/api/find-current-districts-web`);
  return response.data.data;
};

function LocationModal({ isOpen, onClose, onLocationSet }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [, setSelectedTown] = useContext(TownContext);
  const [, setSelectedDistrictContext] = useContext(DistrictContext);
  const toast = useToast();

  const { data, isLoading, error } = useQuery('locationDistricts', fetchLocationDistricts);

  const handleDistrictSelect = (district) => {
    if (district.id === 'all') {
      setSelectedDistrictContext('all');
      setSelectedTown('all');
      localStorage.setItem('selectedDistrictId', 'all');
      localStorage.setItem('selectedTownId', 'all');
      localStorage.setItem('selectedDistrictName', district.name);
      localStorage.setItem('selectedTownName', 'All');
      
      toast({
        title: "Location Selected",
        description: `You have selected ${district.name}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      onLocationSet();
    } else {
      setSelectedDistrict(district);
      setIsTownModalOpen(true);
    }
  };

  const handleTownModalClose = () => {
    setIsTownModalOpen(false);
  };

  const handleLocationSet = () => {
    setIsTownModalOpen(false);
    onClose();
    onLocationSet();
  };

  return (
    <>
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
            <VStack spacing={3} align="stretch">
              <Heading as="h2" size="md" textAlign="center">
                Select Your District
              </Heading>
              <Text textAlign="center" fontSize="sm" color="gray.600">
                Choose your district
              </Text>
              {isLoading && <Text textAlign="center" fontSize="sm">Loading districts...</Text>}
              {error && <Text textAlign="center" fontSize="sm" color="red.500">Error loading districts. Please try again.</Text>}
              {data && (
                <Grid templateColumns="repeat(3, 1fr)" gap={2} width="100%">
                  {data.map((district) => (
                    <GridItem
                      key={district.id}
                      w="100%"
                      h="40px"
                      bg={selectedDistrict?.id === district.id ? "blue.500" : "white"}
                      color={selectedDistrict?.id === district.id ? "white" : "black"}
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
                      onClick={() => handleDistrictSelect(district)}
                    >
                      <Text fontSize="xs" textAlign="center">
                        {district.name}
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

      {selectedDistrict && selectedDistrict.id !== 'all' && (
        <TownModal
          isOpen={isTownModalOpen}
          onClose={handleTownModalClose}
          districtId={selectedDistrict.id}
          districtName={selectedDistrict.name}
          onLocationSet={handleLocationSet}
        />
      )}
    </>
  );
}

export default LocationModal;