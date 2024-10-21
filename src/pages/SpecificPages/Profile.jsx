import React, { useContext, useState } from "react";
import { Box, Button, Flex, useBreakpointValue, Skeleton, SkeletonCircle, useDisclosure, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";
import { FaGoogle, FaUser } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from "swiper/modules";
import { BASE_URL } from "../../config/config";
import emptyillus from "../../assets/empty.png";
import { UserdataContext } from "../../App";
import SellModal from "../../components/modals/othermodals/SellModal";
import { useAuth } from "../../Hooks/AuthContext";
import AdListingCardProfile from "../../components/common/Cards/AdlistingCardProfile";

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const { userData, isLoading: isUserDataLoading } = useContext(UserdataContext);
  const { isLoggedIn, isInitialized, getToken } = useAuth();
  const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure();

  const [visibleAds, setVisibleAds] = useState(3);

  const fetchUserAds = async () => {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/api/find-user-ads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  const { data: userListings, isLoading: isListingsLoading, error: listingsError, refetch: refetchUserAds } = useQuery(
    "userAds",
    fetchUserAds,
    {
      enabled: isLoggedIn,
    }
  );

  const deleteMutation = useMutation(
    async ({ adSubCategoryId, adId }) => {
      const token = await getToken();
      const { data: subCategoryData } = await axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${adSubCategoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data: deleteData } = await axios.delete(`${BASE_URL}/api/${subCategoryData.data.apiUrl}/${adId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return deleteData;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userAds");
        refetchUserAds();
        toast({
          title: "Ad deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: "Error deleting ad",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  React.useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/');
    }
  }, [isInitialized, isLoggedIn, navigate]);

  const handleSellClick = () => {
    if (isLoggedIn) {
      onSellModalOpen();
    } else {
      console.log("User not logged in. Login modal should open here.");
    }
  };

  const handleDeleteListing = async (adId, adSubCategoryId) => {
    deleteMutation.mutate({ adId, adSubCategoryId });
  };

  const handleEditListing = (adId) => {
    // Implement edit functionality
    console.log(`Editing ad with id: ${adId}`);
  };

  const handleShowMore = () => {
    setVisibleAds(prevVisible => prevVisible + 3);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const titleSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });

  const renderProfileImage = () => {
    if (isUserDataLoading) {
      return <SkeletonCircle size="24" />;
    }
    if (userData?.profileImage?.url) {
      return (
        <img
          src={`${BASE_URL}${userData.profileImage.url}`}
          alt="Profile"
          className="w-16 h-16 rounded-full mb-4 object-cover md:w-24 md:h-24"
        />
      );
    } else {
      return (
        <div className="w-16 h-16 rounded-full mb-4 bg-gray-200 flex items-center justify-center md:w-24 md:h-24">
          <FaUser className="text-gray-500 text-3xl md:text-5xl" />
        </div>
      );
    }
  };

  const renderLeftSide = () => {
    if (isUserDataLoading) {
      return (
        <Box width="100%" px={4}>
          {renderProfileImage()}
          <Skeleton height="24px" width="150px" mb={2} />
          <Skeleton height="18px" width="200px" mb={2} />
          <Skeleton height="18px" width="180px" mb={2} />
          <Skeleton height="18px" width="220px" mb={4} />
          <Skeleton height="24px" width="180px" mb={4} />
          <Skeleton height="40px" width="100%" mb={4} />
          <Skeleton height="40px" width="100%" mb={2} />
          <Skeleton height="20px" width="120px" alignSelf="center" />
        </Box>
      );
    }

    return (
      <Box width="100%" px={4}>
        {renderProfileImage()}
        <h2 className={`text-${titleSize} font-semibold mb-2`}>{userData?.name || 'User'}</h2>
        <p className={`text-${textSize} text-gray-600 mb-2`}>{userData?.email || 'No email provided'}</p>
        <p className={`text-${textSize} text-gray-600 mb-2`}>Member since May 2018</p>
        <p className={`text-${textSize} text-gray-600 mb-4`}>3346 Followers · 12 Following</p>
        
        <Box mb={4}>
          <p className={`text-${textSize} text-black font-semibold mb-2`}>User verified with</p>
          <Flex alignItems="center" gap={8}>
            <FaGoogle className="h-6 w-6" />
            <IoLogoWhatsapp className="h-7 w-7" />
            <IoIosMail className="h-7 w-7" />
          </Flex>
        </Box>
        <Button
          onClick={() => navigate('/profile/edit-profile')}
          width="100%"
          mb={2}
          colorScheme="blue"
        >
          Edit Profile
        </Button>
        <Button variant="link" className="text-blue-500">
          Share Profile
        </Button>
      </Box>
    );
  };

  const renderRightSide = () => {
    if (isListingsLoading) {
      return <Skeleton height="200px" width="100%" />;
    }

    if (listingsError) {
      return <Box width="100%">Error loading listings: {listingsError.message}</Box>;
    }

    if (!userListings || userListings.length === 0) {
      return (
        <Flex direction="column" alignItems="center" textAlign="center" p={6} rounded="lg" shadow="sm" maxWidth="sm" mx="auto">
          <img
            src={emptyillus}
            alt="Empty state illustration"
            className="max-h-[200px] w-auto mb-4 md:max-h-[250px] md:max-w-[250px]"
          />
          <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-6 px-16 rounded">
            Start Selling
          </Button>
        </Flex>
      );
    }

    if (isMobile) {
      return (
        <Box width="100%">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1.5}
            pagination={{ clickable: true }}
          >
            {userListings.slice(0, visibleAds).map((listing) => (
              <SwiperSlide key={listing.id}>
                <AdListingCardProfile
                  listing={listing}
                  onEdit={() => handleEditListing(listing.id)}
                  onDelete={() => handleDeleteListing(listing.id, listing.adSubCategory.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {visibleAds < userListings.length && (
            <Button onClick={handleShowMore} colorScheme="blue" variant="outline" mt={4} width="100%">
              Show More
            </Button>
          )}
          <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-6 px-16 rounded mt-4 mx-auto block">
            Start Selling
          </Button>
        </Box>
      );
    }

    return (
      <Box width="100%">
        <Flex direction="column" gap={4}>
          {userListings.slice(0, visibleAds).map((listing) => (
            <AdListingCardProfile
              key={listing.id}
              listing={listing}
              onEdit={() => handleEditListing(listing.id)}
              onDelete={() => handleDeleteListing(listing.id, listing.adSubCategory.id)}
            />
          ))}
        </Flex>
        {visibleAds < userListings.length && (
          <Button onClick={handleShowMore} colorScheme="blue" variant="outline" mt={4} width="100%">
            Show More
          </Button>
        )}
        <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-2 px-16 rounded mt-4 mx-auto block">
          Start Selling
        </Button>
      </Box>
    );
  };

  return (
    <Box maxWidth="" margin="auto" padding={{ base: 4, md: 8 }} className="font-Inter">
      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        <Box width={{ base: "100%", lg: "30%" }} bg="#0071BC1A" py={4} rounded="lg">
          {renderLeftSide()}
        </Box>
        <Box width={{ base: "100%", lg: "70%" }}>
          {renderRightSide()}
        </Box>
      </Flex>
      
      <SellModal 
        isOpen={isSellModalOpen} 
        onClose={onSellModalClose} 
        onSuccessfulSubmit={refetchUserAds}
      />
    </Box>
  );
};

export default Profile;