import React, { useContext, useState, useEffect } from "react";
import { Box, Button, Flex, useBreakpointValue, Skeleton, SkeletonCircle, useDisclosure, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from "axios";
import { FaGoogle, FaUser } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { BASE_URL } from "../../config/config";
import { UserdataContext } from "../../App";
import SellModal from "../../components/modals/othermodals/SellModal";
import { useAuth } from "../../Hooks/AuthContext";
import { ProfileListings } from "../../components/Specific/Profile/ProfileListings";

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const { userData, isLoading: isUserDataLoading } = useContext(UserdataContext);
  console.log(userData);
  
  const { isLoggedIn, isInitialized, getToken } = useAuth();
  const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure();

  const fetchUserAds = async () => {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/api/find-user-ads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  const fetchExpiredAds = async () => {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/api/find-user-expired-ads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  // New function to fetch pending ads
  const fetchPendingAds = async () => {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/api/find-user-pending-ads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  const { 
    data: userListings, 
    isLoading: isListingsLoading, 
    error: listingsError, 
    refetch: refetchUserAds 
  } = useQuery(
    "userAds",
    fetchUserAds,
    {
      enabled: isLoggedIn,
    }
  );

  const { 
    data: expiredListings, 
    isLoading: isExpiredLoading, 
    error: expiredError, 
    refetch: refetchExpiredAds 
  } = useQuery(
    "expiredAds",
    fetchExpiredAds,
    {
      enabled: isLoggedIn,
    }
  );

  // New query for pending ads
  const { 
    data: pendingListings, 
    isLoading: isPendingLoading, 
    error: pendingError,
    refetch: refetchPendingAds 
  } = useQuery(
    "pendingAds",
    fetchPendingAds,
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
        queryClient.invalidateQueries("expiredAds");
        queryClient.invalidateQueries("pendingAds"); // Add pending ads invalidation
        refetchUserAds();
        refetchExpiredAds();
        refetchPendingAds(); // Refetch pending ads
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

  const handleRepostAd = (adId) => {
    // Implement repost functionality
    console.log(`Reposting ad with id: ${adId}`);
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

    const handleShareProfile = () => {
      const profileUrl = `${window.location.origin}#/customer-profile/${userData?.id}`;
      navigator.clipboard.writeText(profileUrl)
        .then(() => {
          toast({
            title: "Profile link copied!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to copy link",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    };

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
        <Box textAlign="center">
          <Button
            variant="link"
            color="blue.500"
            textDecoration="underline"
            onClick={handleShareProfile}
          >
            Share Profile
          </Button>
        </Box>
      </Box>
    );
  };

  // Ensure data fetching on component mount
  useEffect(() => {
    if (isLoggedIn) {
      refetchUserAds();
      refetchExpiredAds();
      refetchPendingAds();
    }
  }, [isLoggedIn, refetchUserAds, refetchExpiredAds, refetchPendingAds]);

  return (
    <Box maxWidth="" margin="auto" padding={{ base: 4, md: 8 }} className="font-Inter">
      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        <Box width={{ base: "100%", lg: "30%" }} bg="#0071BC1A" py={4} rounded="lg">
          {renderLeftSide()}
        </Box>
        <Box width={{ base: "100%", lg: "70%" }}>
          <ProfileListings
            userListings={userListings}
            expiredListings={expiredListings}
            pendingListings={pendingListings}
            isListingsLoading={isListingsLoading}
            isExpiredLoading={isExpiredLoading}
            isPendingLoading={isPendingLoading}
            listingsError={listingsError}
            expiredError={expiredError}
            pendingError={pendingError}
            handleEditListing={handleEditListing}
            handleDeleteListing={handleDeleteListing}
            handleRepostAd={handleRepostAd}
            handleSellClick={handleSellClick}
          />
        </Box>
      </Flex>
      
      <SellModal 
        isOpen={isSellModalOpen} 
        onClose={onSellModalClose} 
        onSuccessfulSubmit={() => {
          refetchUserAds();
          refetchExpiredAds();
          refetchPendingAds();
        }}
      />
    </Box>
  );
};

export default Profile;