import React, { useContext } from "react";
import { Box, Button, Grid, GridItem, SimpleGrid, useBreakpointValue, Skeleton, SkeletonCircle, useDisclosure, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";
import { FaGoogle, FaUser } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
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
      enabled: isLoggedIn ,
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

  // Responsive text sizes
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
        <div className="flex flex-col px-8">
          {renderProfileImage()}
          <Skeleton height="24px" width="150px" mb={2} />
          <Skeleton height="18px" width="200px" mb={2} />
          <Skeleton height="18px" width="180px" mb={2} />
          <Skeleton height="18px" width="220px" mb={4} />
          <Skeleton height="24px" width="180px" mb={4} />
          <Skeleton height="40px" width="100%" mb={4} />
          <Skeleton height="40px" width="100%" mb={2} />
          <Skeleton height="20px" width="120px" alignSelf="center" />
        </div>
      );
    }

    return (
      <div className="flex flex-col px-8">
        {renderProfileImage()}
        <h2 className={`text-${titleSize} font-semibold mb-2`}>{userData?.name || 'User'}</h2>
        <p className={`text-${textSize} text-gray-600 mb-2`}>{userData?.email || 'No email provided'}</p>
        <p className={`text-${textSize} text-gray-600 mb-2`}>Member since May 2018</p>
        <p className={`text-${textSize} text-gray-600 mb-4`}>3346 Followers · 12 Following</p>
        
        <div className="mb-4 flex flex-col gap-4">
          <p className={`text-${textSize} text-black font-semibold`}>User verified with</p>
          <div className="flex items-center gap-8">
            <FaGoogle className="h-6 w-6" />
            <IoLogoWhatsapp className="h-7 w-7" />
            <IoIosMail className="h-7 w-7" />
          </div>
          <Button
            onClick={() => navigate('/profile/edit-profile')}
            className="w-full mb-2"
            colorScheme="blue"
          >
            Edit Profile
          </Button>
          <Button variant="link" className="text-blue-500">
            Share Profile
          </Button>
        </div>
      </div>
    );
  };

  const renderRightSide = () => {
    if (isListingsLoading) {
      return <Skeleton height="200px" />;
    }

    if (listingsError) {
      return <div>Error loading listings: {listingsError.message}</div>;
    }

    if (!userListings || userListings.length === 0) {
      return (
        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm max-w-sm mx-auto">
          <img
            src={emptyillus}
            alt="Empty state illustration"
            className="max-h-[200px] w-auto mb-4 md:max-h-[250px] md:max-w-[250px]"
          />
          <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-6 px-16 rounded">
            Start Selling
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {userListings.map((listing) => (
            <AdListingCardProfile
              key={listing.id}
              listing={listing}
              onEdit={() => handleEditListing(listing.id)}
              onDelete={() => handleDeleteListing(listing.id, listing.adSubCategory.id)}
            />
          ))}
        </SimpleGrid>
        <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-6 px-16 rounded self-center mt-4">
          Start Selling
        </Button>
      </div>
    );
  };

  return (
    <>
      <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
        <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(12, 1fr)" }} gap={6}>
          <GridItem colSpan={{ base: 1, lg: 4 }} className="min-h-[300px] bg-[#0071BC1A] py-2">
            {renderLeftSide()}
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 8 }}>
            {renderRightSide()}
          </GridItem>
        </Grid>
      </Box>
      
      <SellModal 
        isOpen={isSellModalOpen} 
        onClose={onSellModalClose} 
        onSuccessfulSubmit={refetchUserAds}  // Pass the refetch function here
      />
    </>
  );
};

export default Profile;