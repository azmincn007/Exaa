import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  useBreakpointValue,
  Text,
  Image,
  VStack,
  Spinner,
  Center,
  HStack,
} from "@chakra-ui/react";
import { MdAddCircleOutline, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import ShowroomCreateModal from "../../components/modals/othermodals/ShowroomCreateModal";
import { BASE_URL } from "../../config/config";
import emptyillus from '../../assets/empty.png';
import { CiLocationOn } from "react-icons/ci";
import SellShowroomAd from "../../components/modals/othermodals/SellShowroomAd";
import ShowroomUserdata from "../../components/common/Cards/ShowroomuserAdCard";

const fetchShowrooms = async () => {
  const userToken = localStorage.getItem("UserToken");
  const response = await axios.get(
    `${BASE_URL}/api/find-user-ad-showrooms`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  
  return response.data.data;
};

const fetchShowroomAds = async (showroomId) => {
  const userToken = localStorage.getItem("UserToken");
  const response = await axios.get(
    `${BASE_URL}/api/find-user-showroom-ads/${showroomId}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  console.log(response.data.data);

  return response.data.data;
};

const MyShowroom = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [currentShowroomIndex, setCurrentShowroomIndex] = useState(0);
  const showroomContainerRef = useRef(null);

  const queryClient = useQueryClient();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const storedTownName = localStorage.getItem('selectedTownName');
    if (storedTownName) {
      setSelectedLocation(storedTownName);
    }
  }, []);

  const textSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const titleSize = useBreakpointValue({ base: "md", md: "lg", lg: "xl" });

  const { data: showrooms, isLoading: showroomsLoading, error: showroomsError } = useQuery(
    "showrooms",
    fetchShowrooms,
    {
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    }
  );

  const { data: showroomAds, isLoading: adsLoading, error: adsError } = useQuery(
    ["showroomAds", selectedShowroom?.id],
    () => fetchShowroomAds(selectedShowroom?.id),
    {
      enabled: !!selectedShowroom?.id,
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (showrooms && showrooms.length > 0) {
      setSelectedShowroom(showrooms[0]);
    }
  }, [showrooms]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSellModalOpen = () => setIsSellModalOpen(true);
  const handleSellModalClose = () => setIsSellModalOpen(false);

  const handleShowroomSelect = (showroom, index) => {
    setSelectedShowroom(showroom);
    setCurrentShowroomIndex(index);
  };

  const handleAdCreated = () => {
    queryClient.invalidateQueries(["showroomAds", selectedShowroom?.id]);
  };

  const scrollShowrooms = (direction) => {
    if (showroomContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      showroomContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePrevShowroom = () => {
    if (currentShowroomIndex > 0) {
      handleShowroomSelect(showrooms[currentShowroomIndex - 1], currentShowroomIndex - 1);
    }
  };

  const handleNextShowroom = () => {
    if (currentShowroomIndex < showrooms.length - 1) {
      handleShowroomSelect(showrooms[currentShowroomIndex + 1], currentShowroomIndex + 1);
    }
  };

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
          overflowX={{ base: "hidden", md: "visible" }}
          position="relative"
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
          {isMobile && showrooms && showrooms.length > 1 && (
            <HStack justify="space-between" position="absolute" top="50%" width="100%" zIndex="1">
              <Button onClick={handlePrevShowroom} disabled={currentShowroomIndex === 0}>
                <MdChevronLeft />
              </Button>
              <Button onClick={handleNextShowroom} disabled={currentShowroomIndex === showrooms.length - 1}>
                <MdChevronRight />
              </Button>
            </HStack>
          )}
          <VStack 
            spacing={4} 
            align="stretch" 
            p={4} 
            ref={showroomContainerRef}
            overflowX={{ base: "auto", md: "visible" }}
            css={{
              scrollSnapType: "x mandatory",
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {showrooms && showrooms.length > 0 ? (
              <HStack spacing={4} width={isMobile ? `${showrooms.length * 100}%` : "100%"}>
                {showrooms.map((showroom, index) => (
                  <Box
                    key={showroom.id}
                    borderRadius="xl"
                    overflow="hidden"
                    bg={selectedShowroom?.id === showroom.id ? "#4F7598" : "#23496C"}
                    color="white"
                    className="p-4"
                    cursor="pointer"
                    onClick={() => handleShowroomSelect(showroom, index)}
                    flexShrink={0}
                    width={isMobile ? "100%" : "auto"}
                    scrollSnapAlign="start"
                  >
                    <Image
                      src={`${BASE_URL}${showroom.images?.url}`}
                      alt={showroom.name}
                      objectFit="cover"
                      height="100px"
                      width="100%"
                      bg="black"
                      className="rounded-xl"
                    />
                    <Box p={2}>
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {showroom.name}
                      </Text>
                      <Text fontSize="sm">Category: {showroom.adCategory?.name}</Text>
                      <Text fontSize="sm">
                        Created On: {new Date(showroom.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </HStack>
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
              <div className="flex justify-between">
                <h2 className="font-semibold text-20">My Showroom - {selectedShowroom.name}</h2>
                <Button leftIcon={<CiLocationOn />} className="bg-[#D2BA8580]" variant='solid'>
                  {selectedShowroom.locationTown?.name}
                </Button>
              </div>
              {adsLoading ? (
                <Center flex={1}>
                  <Spinner size="xl" />
                </Center>
              ) : adsError ? (
                <Center flex={1}>
                  <Text color="red.500">Error loading showroom ads: {adsError.message}</Text>
                </Center>
              ) : showroomAds && showroomAds.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {showroomAds.map((ad) => (
                    <ShowroomUserdata key={ad.id} data={ad} />
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
                Select a showroom to view details
              </Text>
            </Center>
          )}
        </GridItem>
      </Grid>

      <ShowroomCreateModal isOpen={isOpen} onClose={handleClose} />
      
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
    </Box>
  );
};

export default MyShowroom;