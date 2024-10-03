import React, { useState, useEffect, useContext } from "react";
import { Box, Flex, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileEditForm from "../../components/Specific/Profile/ProfileEdit";
import ProfilePictureUpload from "../../components/Specific/Profile/ProfilePictureUpload";
import { UserdataContext } from "../../App";
import { useAuth } from "../../Hooks/AuthContext";
import EditProfileSkeleton from "../../components/Skelton/ProfileEditSkelton";

const EditProfile = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate=useNavigate()
  const { isLoggedIn,isInitialized } = useAuth();
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/');
    }
  }, [isInitialized, isLoggedIn, navigate]);

 
  const { userData, isLoading } = useContext(UserdataContext);


  console.log(userData);

  if (!isInitialized || isLoading) {
    return <EditProfileSkeleton />;
  }



  

  return (
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      <Flex
        display={{ base: "column", md: "none" }}
        justify="space-between"
        mb={6}
        className="gap-4 bg-[#0071BC1A] p-4"
      >
        <Text
          fontWeight={activeSection === "profile" ? "bold" : "normal"}
          cursor="pointer"
          onClick={() => setActiveSection("profile")}
        >
          Edit Profile
        </Text>
        <Text
          fontWeight={activeSection === "photo" ? "bold" : "normal"}
          cursor="pointer"
          onClick={() => setActiveSection("photo")}
        >
          Profile Picture
        </Text>
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 3fr" }}
        gap={6}
      >
        <GridItem display={{ base: "none", md: "block" }} className="min-h-[300px] bg-[#0071BC1A] py-2">
          <div className="px-2 flex flex-col gap-4">
            <Text
              fontWeight={activeSection === "profile" ? "bold" : "normal"}
              cursor="pointer"
              onClick={() => setActiveSection("profile")}
            >
              Edit Profile
            </Text>
            <Text
              fontWeight={activeSection === "photo" ? "bold" : "normal"}
              cursor="pointer"
              onClick={() => setActiveSection("photo")}
            >
              Profile Picture
            </Text>

            <Button onClick={()=>navigate(-1)} className="border-blue-500 border-2 bg-transparent text-bluw-500"> View Profile</Button>

          </div>
        </GridItem>

        <GridItem className="flex justify-center items-center">
          {activeSection === "profile" && <ProfileEditForm/>}
          {activeSection === "photo" && <ProfilePictureUpload  />}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EditProfile;