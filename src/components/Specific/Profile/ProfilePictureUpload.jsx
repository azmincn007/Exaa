import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Box, Text, Button, VStack, Grid, GridItem, Image, Center, Icon, useToast } from '@chakra-ui/react';
import { BiImageAdd } from 'react-icons/bi';
import { MdOutlineModeEdit } from 'react-icons/md';
import { BASE_URL } from '../../../config/config';
import { UserdataContext } from '../../../App';

const ProfilePictureUpload = () => {
  const { userData, setUserData } = useContext(UserdataContext);
  const { register, handleSubmit } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Set the initial preview image to the user's existing profile picture
    setPreviewImage(`${BASE_URL}${userData?.profileImage?.url}`);
  }, [userData]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('UserToken');
    try {
      const response = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.data); // Update context with the latest user data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const onSubmit = async (data) => {
    if (!data.profileImage || !data.profileImage[0]) {
      toast({
        title: "No image selected",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('profileImage', data.profileImage[0]);

    const token = localStorage.getItem('UserToken');

    if (!token) {
      toast({
        title: "Authentication error",
        description: "No authentication token found. Please log in again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsUploading(false);
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/api/auth/changeProfile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Fetch latest user data immediately after successful upload
        await fetchUserData();
        setPreviewImage(userData?.profileImage || null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error uploading image",
        description: error.response?.data?.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box borderWidth="2px" borderRadius="lg" p={6} width="100%" maxWidth="800px" borderColor="black">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Profile Picture
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns="4fr 8fr" gap={6}>
          <GridItem>
            <Box
              position="relative"
              width="100%"
              paddingBottom="100%"
              bg="blue.100"
              borderRadius="md"
            >
              <Center
                position="absolute"
                top="5%"
                left="5%"
                width="90%"
                height="90%"
                overflow="hidden"
                borderRadius="full"
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <Icon as={BiImageAdd} boxSize="50%" color="gray.400" />
                )}
              </Center>
              <Button
                size="sm"
                position="absolute"
                top={2}
                right={2}
                colorScheme="gray"
                variant="solid"
                opacity={0.8}
                as="label"
                htmlFor="profileImage"
              >
                <MdOutlineModeEdit size={16} />
              </Button>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                {...register('profileImage', {
                  onChange: handleImageChange,
                })}
              />
            </Box>
          </GridItem>
          <GridItem>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Update your profile picture to enhance your online presence.
              </Text>
              <Text fontSize="sm" color="gray.600">
                Choose a clear and professional image that represents you best.
              </Text>
              <Text fontSize="sm" color="gray.600">
                Click 'Upload' to select a new photo or use your Google account for quick access.
              </Text>
              <div className="w-[50%] gap-2 flex flex-col">
                <Button 
                  colorScheme="blue" 
                  width="100%" 
                  variant="outline" 
                  type="submit"
                  isLoading={isUploading}
                  loadingText="Uploading..."
                >
                  Upload
                </Button>
              </div>
            </VStack>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default ProfilePictureUpload;