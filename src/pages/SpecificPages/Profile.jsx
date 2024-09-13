import React from "react";
import { Box, Button, Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import emptyillus from "../../assets/empty.png";
import { FaGoogle } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  

  // Responsive text sizes
  const textSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const titleSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });

  return (
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      <Grid templateColumns={{ base: "repeat(12, 1fr)", md: "repeat(6, 1fr)", lg: "repeat(12, 1fr)" }} gap={6}>
        <GridItem colSpan={{ base: 12, md: 6, lg: 4 }} className="min-h-[300px] bg-[#0071BC1A] py-2">
          <div className="flex flex-col px-8">
            <img
              src="/api/placeholder/160/160"
              alt="Profile"
              className="w-16 h-16 rounded-full mb-4 bg-black md:w-24 md:h-24"
            />
            <h2 className={`text-${titleSize} font-semibold mb-2`}>{userData.name}</h2>
            <p className={`text-${textSize} text-gray-600 mb-2`}>{userData.email}</p>
            <p className={`text-${textSize} text-gray-600 mb-2`}>Member since May 2018</p>
            <p className={`text-${textSize} text-gray-600 mb-4`}>3346 Followers · 12 Following</p>

            <div className="mb-4 flex flex-col gap-4">
              <p className={`text-${textSize} text-black font-semibold`}>User verified with</p>
              <div className="flex items-center gap-8">
                <FaGoogle className="h-6 w-6" />
                <IoLogoWhatsapp className="h-7 w-7" />
                <IoIosMail className="h-7 w-7" />
              </div>
              <Button onClick={()=>navigate('/profile/edit-profile')} className="w-full mb-2" colorScheme="blue">
                Edit Profile
              </Button>
              <Button variant="link" className="text-blue-500">
                Share Profile
              </Button>
            </div>
          </div>
        </GridItem>
        <GridItem colSpan={{ base: 12, md: 6, lg: 8 }} className="flex justify-center items-center">
          <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm max-w-sm mx-auto">
            <img
              src={emptyillus}
              alt="Empty state illustration"
              className="max-h-[200px] w-auto mb-4 md:max-h-[250px] md:max-w-[250px]" // Responsive image size
            />
            <h2 className={`text-${titleSize} font-semibold mb-2`}>You haven't listed anything yet</h2>
            <p className={`text-${textSize} text-gray-600 mb-4`}>Lorem ipsum dolor sit amet consectetur.</p>
            <Button colorScheme="blue" className="text-white font-medium py-6 px-16 rounded">
              Start Selling
            </Button>
          </div>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Profile;