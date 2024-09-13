import React, { useState } from "react";
import { Box, Flex, Text, Grid, GridItem } from "@chakra-ui/react";
import ProfileEditForm from "../../components/Specific/Profile/ProfileEdit";
import ProfilePictureUpload from "../../components/Specific/Profile/ProfilePictureUpload";

const EditProfile = () => {
  // State to manage the active section
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <Box maxWidth="container" margin="auto" padding={8} className="font-Inter">
      {/* Flex container for navigation */}
      <Flex 
        display={{ base: "column", md: "none" }} // Show only on small screens
        justify="space-between"
        mb={6} // Margin bottom for spacing
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

      {/* Grid layout for larger devices */}
      <Grid 
        templateColumns={{ base: "1fr", md: "1fr 3fr" }} // Stack on small screens, side by side on larger screens
        gap={6}
      >
        {/* Sidebar for larger screens */}
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
          </div>
        </GridItem>

        {/* Content area */}
        <GridItem className="flex justify-center items-center">
          {activeSection === "profile" && <ProfileEditForm />}
          {activeSection === "photo" && <ProfilePictureUpload />}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EditProfile;