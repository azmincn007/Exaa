// MyShowroom.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  useBreakpointValue,
  Text,
  Image,
  VStack,
  Center,
  useToast,
} from "@chakra-ui/react";
import { MdAddCircleOutline } from "react-icons/md";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ShowroomCreateModal from "../../components/modals/othermodals/ShowroomCreateModal";
import { BASE_URL } from "../../config/config";
import emptyillus from '../../assets/empty.png';
import { CiLocationOn } from "react-icons/ci";
import SellShowroomAd from "../../components/modals/othermodals/SellShowroomAd";
import ShowroomUserdata from "../../components/common/Cards/ShowroomuserAdCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/AuthContext";
import ShowroomSkeleton from "../../components/Skelton/ShowroomSkleton";
import ShowroomContentCard from "../../components/common/Cards/ShowroomContentCard";
import ShowroomEditModal from "../../components/modals/othermodals/Showroomeditmodal";
import CarListingCard from "../../components/common/Cards/ShowroomuserAdCard";
import ShowroomuserAdCard from "../../components/common/Cards/ShowroomuserAdCard";
import EditShowroomModal from "../../components/modals/othermodals/EditShowroomAd";
import EditShowroomad from "../../components/modals/othermodals/EditShowroomAd";

const fetchShowrooms = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/find-user-ad-showrooms`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

const fetchShowroomAds = async (showroomId, token) => {
  const response = await axios.get(
    `${BASE_URL}/api/find-user-showroom-ads/${showroomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

const MyShowroom = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showroomToEdit, setShowroomToEdit] = useState(null);
  const [isEditAdModalOpen, setIsEditAdModalOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState(null);
  const handleAdEdit = (ad) => {
    setAdToEdit(ad);
    setIsEditAdModalOpen(true);
  };

  const handleEditAdModalClose = () => {
    setIsEditAdModalOpen(false);
    setAdToEdit(null);
  };

  const handleEditAdSuccess = () => {
    queryClient.invalidateQueries(["showroomAds", selectedShowroom?.id]);
    handleEditAdModalClose();
    
    toast({
      title: "Ad updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  

  const { isLoggedIn, isInitialized, token } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/');
    }
  }, [isInitialized, isLoggedIn, navigate]);

  const { data: showrooms, isLoading: showroomsLoading, error: showroomsError } = useQuery(
    ["showrooms", token],
    () => fetchShowrooms(token),
    {
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      enabled: !!token,
    }
  );

  const { data: showroomAds, isLoading: adsLoading, error: adsError } = useQuery(
    ["showroomAds", selectedShowroom?.id, token],
    () => fetchShowroomAds(selectedShowroom?.id, token),
    {
      enabled: !!selectedShowroom?.id && !!token,
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (showrooms && showrooms.length > 0 && !selectedShowroom) {
      setSelectedShowroom(showrooms[0]);
    }
  }, [showrooms, selectedShowroom]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSellModalOpen = () => setIsSellModalOpen(true);
  const handleSellModalClose = () => setIsSellModalOpen(false);

  const handleShowroomSelect = (showroom) => {
    setSelectedShowroom(showroom);
  };

  const handleShowroomDelete = async (deletedShowroomId) => {
    // Get current showrooms from cache
    const currentShowrooms = queryClient.getQueryData(["showrooms"]) || [];
    
    // Optimistically update the showrooms list
    const updatedShowrooms = currentShowrooms.filter(s => s.id !== deletedShowroomId);
    queryClient.setQueryData(["showrooms"], updatedShowrooms);

    // If the deleted showroom was selected, select the first available showroom
    if (selectedShowroom?.id === deletedShowroomId) {
      const nextShowroom = updatedShowrooms[0] || null;
      setSelectedShowroom(nextShowroom);
    }

    // Invalidate the queries to ensure consistency
    await Promise.all([
      queryClient.invalidateQueries(["showrooms"]),
      queryClient.invalidateQueries(["showroomAds", deletedShowroomId])
    ]);

    toast({
      title: "Showroom deleted successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const handleAdCreated = () => {
    queryClient.invalidateQueries(["showroomAds", selectedShowroom?.id]);
    handleSellModalClose();
    
    toast({
      title: "Ad created successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShowroomEdit = (showroom) => {
    setShowroomToEdit(showroom);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setShowroomToEdit(null);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries("showrooms");
    handleEditModalClose();
    
    toast({
      title: "Showroom updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (showroomsLoading || !isInitialized || adsLoading) {
    return <ShowroomSkeleton />;
  }

  if (showroomsError || adsError) {
    return (
      <Center height="100vh">
        <Text>Error loading data. Please try again later.</Text>
      </Center>
    );
  }

  return (
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(6, 1fr)",
          lg: "repeat(12, 1fr)",
        }}
        gap={6}
      >
        <GridItem 
          colSpan={{ base: 1, md: 6, lg: 4 }} 
          bg="#0071BC1A" 
          height={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          overflowX="hidden"
          position="relative"
          className="rounded-xl"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#4F7598',
              borderRadius: '24px',
            },
          }}
        >
          <VStack spacing={4} align="stretch" p={4}>
            {showrooms && showrooms.length > 0 ? (
              isMobile ? (
                <Swiper
                  className="w-full"
                  spaceBetween={30}
                  slidesPerView={1}
                  onSlideChange={(swiper) => handleShowroomSelect(showrooms[swiper.activeIndex])}
                >
                  {showrooms.map((showroom) => (
                    <SwiperSlide key={showroom.id}>
                      <ShowroomContentCard
                        showroom={showroom}
                        isSelected={selectedShowroom?.id === showroom.id}
                        onClick={handleShowroomSelect}
                        onEdit={handleShowroomEdit}
                        onDeleteSuccess={handleShowroomDelete}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                showrooms.map((showroom) => (
                  <ShowroomContentCard
                    key={showroom.id}
                    showroom={showroom}
                    isSelected={selectedShowroom?.id === showroom.id}
                    onClick={handleShowroomSelect}
                    onEdit={handleShowroomEdit}
                    onDeleteSuccess={handleShowroomDelete}
                  />
                ))
              )
            ) : (
              <Box textAlign="center">
                <Image
                  src={emptyillus}
                  alt="No showrooms"
                  mx="auto"
                  className="max-w-[200px] max-h-[200px]"
                  mb={4}
                />
                <Text fontSize="lg" fontWeight="medium" mb={4}>
                  No showrooms found
                </Text>
              </Box>
            )}

            <Button
              leftIcon={<MdAddCircleOutline />}
              colorScheme="blue"
              size="lg"
              borderRadius="xl"
              bg="#4F7598"
              _hover={{ bg: "#3182CE" }}
              onClick={handleOpen}
            >
              Create New Showroom
            </Button>
          </VStack>
        </GridItem>

        <GridItem
          colSpan={{ base: 1, md: 6, lg: 8 }}
          bg="#0071BC1A"
          minHeight="300px"
          borderRadius="xl"
          boxShadow="md"
          p={6}
        >
          {selectedShowroom ? (
            <VStack spacing={4} align="stretch" height="100%">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl">
                  My Showroom - {selectedShowroom.name}
                </h2>
                <Button 
                  leftIcon={<CiLocationOn />} 
                  className="bg-[#D2BA8580]" 
                  variant='solid'
                  size="sm"
                >
                  {selectedShowroom.locationTown?.name || "Location not set"}
                </Button>
              </div>

              {showroomAds && showroomAds.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {showroomAds.map((ad) => (
                    <ShowroomuserAdCard 
                    key={ad.id} 
                    data={ad} 
                    onEdit={handleAdEdit}
                  />
                  ))}
                  <Button
                    leftIcon={<MdAddCircleOutline />}
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    onClick={handleSellModalOpen}
                    alignSelf="center"
                    mt={4}
                  >
                    New Post
                  </Button>
                </VStack>
              ) : (
                <Center flex={1} flexDirection="column">
                  <Image
                    src={emptyillus}
                    alt="No posts"
                    maxWidth="200px"
                    maxHeight="200px"
                    mb={4}
                  />
                  <Text fontSize="lg" fontWeight="medium" mb={4}>
                    No posts yet in this showroom
                  </Text>
                  <Button
                    leftIcon={<MdAddCircleOutline />}
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    onClick={handleSellModalOpen}
                  >
                    New Post
                  </Button>
                </Center>
              )}
            </VStack>
          ) : (
            <Center height="100%">
              <Text fontSize="lg" fontWeight="medium">
                Please select or create a showroom
              </Text>
            </Center>
          )}
        </GridItem>
      </Grid>

      <ShowroomCreateModal 
        isOpen={isOpen} 
        onClose={handleClose} 
        onSuccess={() => {
          queryClient.invalidateQueries("showrooms");
          handleClose();
        }}
      />
      
      {selectedShowroom && (
        <SellShowroomAd
          isOpen={isSellModalOpen}
          onClose={handleSellModalClose}
          categoryId={selectedShowroom.adCategory?.id}
          subCategoryId={selectedShowroom.adSubCategory?.id}
          districtId={selectedShowroom.locationDistrict?.id}
          townId={selectedShowroom.locationTown?.id}
          showroomid={selectedShowroom.id}
          onAdCreated={handleAdCreated}
        />
      )}

      {showroomToEdit && (
        <ShowroomEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          showroom={showroomToEdit}
          onSuccess={handleEditSuccess}
        />
      )}

{adToEdit && (
  <EditShowroomad
          isOpen={isEditAdModalOpen}
          onClose={handleEditAdModalClose}
          ad={adToEdit}
          onSuccess={handleEditAdSuccess}
          categoryId={selectedShowroom.adCategory?.id}
          subCategoryId={selectedShowroom.adSubCategory?.id}
          districtId={selectedShowroom.locationDistrict?.id}
          townId={selectedShowroom.locationTown?.id}
          showroomId={selectedShowroom.id}
        />
      )}
    </Box>
  );
};

export default MyShowroom;