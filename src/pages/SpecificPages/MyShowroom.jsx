// MyShowroom.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Grid, GridItem, useBreakpointValue, Text, Image, VStack, Center, useToast } from "@chakra-ui/react";
import { MdAddCircleOutline } from "react-icons/md";
import { useQuery, useQueryClient } from 'react-query';
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ShowroomCreateModal from "../../components/modals/othermodals/ShowroomCreateModal";
import { BASE_URL } from "../../config/config";
import emptyillus from "../../assets/empty.png";
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
import CongratulationsModal from "../../components/modals/othermodals/SellSuccessmodal";

const fetchShowrooms = async (token) => {
  const response = await axios.get(`${BASE_URL}/api/find-user-ad-showrooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

const fetchShowroomAds = async (showroomId, token) => {
  const response = await axios.get(`${BASE_URL}/api/find-user-showroom-ads/${showroomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updatedAd, setUpdatedAd] = useState(null);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  

  const { isLoggedIn, isInitialized, token } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate("/");
    }
  }, [isInitialized, isLoggedIn, navigate]);

  const {
    data: showrooms,
    isLoading: showroomsLoading,
    error: showroomsError,
    refetch: refetchShowrooms,
  } = useQuery(["showrooms", token], () => fetchShowrooms(token), {
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    enabled: !!token,
  });

  const {
    data: showroomAds,
    isLoading: adsLoading,
    error: adsError,
    refetch: refetchShowroomAds,
  } = useQuery(
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

  const handleShowroomCreated = useCallback(async (newShowroom) => {
    console.log("New showroom created:", newShowroom);
    await refetchShowrooms();
    setSelectedShowroom(newShowroom);
    handleClose();
    toast({
      title: "Showroom created successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [refetchShowrooms, handleClose, toast]);

  const handleShowroomSelect = useCallback((showroom) => {
    setSelectedShowroom(showroom);
  }, []);

  const handleShowroomDelete = useCallback(async (deletedShowroomId) => {
    await refetchShowrooms();
    if (selectedShowroom?.id === deletedShowroomId) {
      const updatedShowrooms = showrooms.filter(s => s.id !== deletedShowroomId);
      setSelectedShowroom(updatedShowrooms[0] || null);
    }
   
  }, [refetchShowrooms, selectedShowroom, showrooms, toast]);

  const handleAdCreated = useCallback(async (newAd) => {
    // Update the local cache with the new ad
    queryClient.setQueryData(
      ["showroomAds", selectedShowroom.id],
      (oldData) => oldData ? [newAd, ...oldData] : [newAd]
    );

    // Optionally, you can still refetch to ensure consistency with the server
    await refetchShowroomAds();
    
    handleSellModalClose();
  
  }, [queryClient, selectedShowroom, refetchShowroomAds, handleSellModalClose, toast]);

  const handleShowroomEdit = useCallback((showroom) => {
    setShowroomToEdit(showroom);
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setShowroomToEdit(null);
  }, []);

  const handleEditSuccess = useCallback(async (updatedShowroom) => {
    await refetchShowrooms();
    setSelectedShowroom(updatedShowroom);
    handleEditModalClose();
    toast({
      title: "Showroom updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [refetchShowrooms, handleEditModalClose, toast]);

  const handleAdEdit = useCallback((ad) => {
    setAdToEdit(ad);
    setIsEditAdModalOpen(true);
  }, []);

  const handleEditAdModalClose = useCallback(() => {
    setIsEditAdModalOpen(false);
    setAdToEdit(null);
  }, []);

  const handleEditAdSuccess = useCallback(async () => {
    await refetchShowroomAds();
    setShowSuccessModal(false);
  }, [refetchShowroomAds]);

  // Add new handler for success modal
  const handleShowSuccessModal = useCallback((data) => {
 
    console.log('adData:', data.adData);
  

    setUpdatedAd({
      ...data.adData,
      adCategory: data.adData.adCategory?.id, // Extract just the ID from adCategory
      adSubCategory: data.adData.adSubCategory?.id, // Extract just the ID from adSubCategory
      images: data.images ,
      brand:data.adData.brand?.id,
      model:data.adData.model?.id,
      variant:data.adData.variant?.id,
      type: data.adData.type?.id,// Use the received image files directly
    });
    setSubCategoryDetails(data.subCategoryDetails);
    setShowSuccessModal(true);
  }, []);

  const handleAdDeleted = useCallback(async (adData) => {
    if (!adData?.id || !adData?.adSubCategory?.id) {
      console.error("Invalid ad data:", adData);
      return;
    }

    try {
      // Optimistically update the UI first
      queryClient.setQueryData(['showroomAds', selectedShowroom.id], (oldData) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.filter(ad => ad?.id !== adData?.id);
      });

      // Get the sub-category details
      const { data: subCategoryData } = await axios.get(
        `${BASE_URL}/api/ad-find-one-sub-category/${adData.adSubCategory.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const apiUrl = subCategoryData.data.apiUrl;

      // Delete the ad
      await axios.delete(
        `${BASE_URL}/api/${apiUrl}/${adData?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Show success toast
      toast({
        title: "Ad deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refetch to ensure data consistency
      await refetchShowroomAds();

    } catch (error) {
      console.error("Error deleting ad:", error);
      
      // Show error toast
      toast({
        title: "Error deleting ad",
        description: error.response?.data?.message || "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      
      // Revert the optimistic update by refetching
      await refetchShowroomAds();
    }
  }, [queryClient, selectedShowroom?.id, token, toast, refetchShowroomAds]);

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
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#4F7598",
              borderRadius: "24px",
            },
          }}
        >
          <VStack spacing={4} align="stretch" p={4}>
            {showrooms && showrooms.length > 0 ? (
              isMobile ? (
                <Swiper className="w-full" spaceBetween={30} slidesPerView={1} onSlideChange={(swiper) => handleShowroomSelect(showrooms[swiper.activeIndex])}>
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
                <Image src={emptyillus} alt="No showrooms" mx="auto" className="max-w-[200px] max-h-[200px]" mb={4} />
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

        <GridItem colSpan={{ base: 1, md: 6, lg: 8 }} bg="#0071BC1A" minHeight="300px" borderRadius="xl" boxShadow="md" p={6}>
          {selectedShowroom ? (
            <VStack spacing={4} align="stretch" height="100%">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl">My Showroom - {selectedShowroom?.name}</h2>
                <Button leftIcon={<CiLocationOn />} className="bg-[#D2BA8580]" variant="solid" size="sm">
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
               onDelete={handleAdDeleted}
               showroomId={selectedShowroom?.id}
               token={token}
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
                    isDisabled={!selectedShowroom || !selectedShowroom.locationTown?.name}
                    title={!selectedShowroom.locationTown?.name ? "Please set a location for this showroom first" : ""}
                  >
                    New Post
                  </Button>
                </VStack>
              ) : (
                <Center flex={1} flexDirection="column">
                  <Image src={emptyillus} alt="No posts" maxWidth="200px" maxHeight="200px" mb={4} />
                  <Text fontSize="lg" fontWeight="medium" mb={4}>
                    No posts yet in this showroom
                  </Text>
                  <Button 
                    leftIcon={<MdAddCircleOutline />} 
                    colorScheme="blue" 
                    size="lg" 
                    borderRadius="xl" 
                    onClick={handleSellModalOpen}
                    isDisabled={!selectedShowroom || !selectedShowroom.locationTown?.name}
                    title={!selectedShowroom.locationTown?.name ? "Please set a location for this showroom first" : ""}
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
        onSuccess={handleShowroomCreated}
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

      {showroomToEdit && <ShowroomEditModal isOpen={isEditModalOpen} onClose={handleEditModalClose} showroom={showroomToEdit} onSuccess={handleEditSuccess} />}

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
          onShowSuccess={(data) => {
            console.log('onShowSuccess callback triggered with data:', data);
            handleShowSuccessModal(data);
          }}
        />
      )}

      {showSuccessModal && updatedAd && subCategoryDetails && (
        <CongratulationsModal
          adType="Showroom Ad"
          onClose={() => {
            setShowSuccessModal(false);
            handleEditAdSuccess();
          }}
          adId={updatedAd.id}
          formData={updatedAd}
          apiUrl={subCategoryDetails.apiUrl}
          isTagCreationPossible={true}
          images={updatedAd.images}
        />
      )}
    </Box>
  );
};

export default MyShowroom;
