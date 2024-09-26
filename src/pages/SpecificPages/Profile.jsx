import React, { useContext } from "react";
import { Box, Button, Grid, GridItem, useBreakpointValue, Skeleton, SkeletonCircle, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaUser } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { BASE_URL } from "../../config/config";
import emptyillus from "../../assets/empty.png";
import { UserdataContext } from "../../App";
import SellModal from "../../components/modals/othermodals/SellModal";
import { useAuth } from "../../Hooks/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { userData, isLoading } = useContext(UserdataContext);
  
  const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure();
  
  const handleSellClick = () => {
    if (isLoggedIn) {
      onSellModalOpen();
    } else {
      onLoginModalOpen();
    }
  };


  // Responsive text sizes
  const textSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const titleSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });

  const renderProfileImage = () => {
    if (isLoading) {
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
    if (isLoading) {
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
            onClick={() => navigate('/profile/edit-profile', )}
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

  return (
    <>
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      <Grid templateColumns={{ base: "repeat(12, 1fr)", md: "repeat(6, 1fr)", lg: "repeat(12, 1fr)" }} gap={6}>
        <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} className="min-h-[300px] bg-[#0071BC1A] py-2">
          {renderLeftSide()}
        </GridItem>
        <GridItem colSpan={{ base: 12, md: 6, lg: 8 }} className="flex justify-center items-center">
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm max-w-sm mx-auto">
            <img
              src={emptyillus}
              alt="Empty state illustration"
              className="max-h-[200px] w-auto mb-4 md:max-h-[250px] md:max-w-[250px]"
            />
      
            <Button  onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-6 px-16 rounded">
              Start Selling
            </Button>
          </div>
        </GridItem>
      </Grid>
    </Box>
    
    <SellModal isOpen={isSellModalOpen} onClose={onSellModalClose} />

              </>
  );
};

export default Profile;