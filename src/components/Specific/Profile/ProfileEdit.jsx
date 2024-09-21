import React from 'react';
import {
  Box,
  Input,
  Button,
  Grid,
  GridItem,
  Text,
  VStack,
  InputGroup,
  InputLeftAddon,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/config';

const ProfileEditForm = ({ userData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: userData.name,
      phone: userData.phone?.slice(-10) || '',
      email: userData.email,
    }
  });
  const navigate = useNavigate();
  const toast = useToast();
  const userToken = localStorage.getItem('UserToken'); // Retrieve token once

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', `+91${data.phone}`);
    console.log('FormData being sent:', formData);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/changeProfile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formData
      });

      console.log('Full response:', response);
      const responseData = await response.json();
      console.log('Response data:', responseData);
      if (response.ok) {
        toast({
          title: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/'); // Removed window.location.reload()
      } else {
        let errorMessage = responseData?.message || 'Failed to update profile';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error details:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDiscard = () => {
    navigate('/profile');
  };

  return (
    <Box maxWidth="800px" margin="auto" p={6} borderWidth={2} borderRadius="lg" boxShadow="md" borderColor="black">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Basic Information</Text>
            <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
              <GridItem colSpan={{ base: 12, md: 5 }}>
                <FormControl>
                  <Input
                    {...register("name")}
                    placeholder={userData.name}
                    border="1px"
                    borderColor="black"
                    _hover={{ borderColor: 'black' }}
                    _focus={{ borderColor: 'blue' }}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 7 }}>
                {/* No error message for name field */}
              </GridItem>
            </Grid>
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Contact Information</Text>
            <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
              <GridItem colSpan={{ base: 12, md: 5 }}>
                <FormControl isInvalid={errors.phone}>
                  <InputGroup>
                    <InputLeftAddon
                      children="+91 |"
                      bg="transparent"
                      border="1px"
                      borderColor="black"
                      borderRight="none"
                      color="gray.500"
                    />
                    <Input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits"
                        }
                      })}
                      placeholder={userData.phone.slice(-10)}
                      border="1px"
                      borderColor="black"
                      borderLeft="none"
                      _hover={{ borderColor: 'black' }}
                      _focus={{ borderColor: 'blue' }}
                    />
                  </InputGroup>
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 7 }}>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={errors.phone ? "red.500" : "gray.500"}>
                  {errors.phone ? errors.phone.message : ""}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 5 }}>
                <FormControl isInvalid={errors.email}>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    placeholder={userData.email}
                    border="1px"
                    borderColor="black"
                    _hover={{ borderColor: 'black' }}
                    _focus={{ borderColor: 'blue' }}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 7 }}>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={errors.email ? "red.500" : "gray.500"}>
                  {errors.email ? errors.email.message : ""}
                </Text>
              </GridItem>
            </Grid>
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Additional Information</Text>
            <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
              <GridItem colSpan={{ base: 12, md: 5 }}>
                <Text fontWeight="bold">Google</Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
              </GridItem>
              <GridItem className='flex justify-end' colSpan={{ base: 12, md: 7 }}>
                <Button
                  variant="outline"
                  borderWidth={1}
                  borderColor="black"
                  size="md"
                  width="100%"
                  _hover={{
                    bg: '#0071BC',
                    color: 'white',
                    borderColor: 'transparent',
                    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                  }}
                  _active={{
                    bg: '#005B8C',
                    transform: 'scale(0.95)',
                  }}
                >
                  Link
                </Button>
              </GridItem>
            </Grid>
          </Box>
          <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Button
                width='100%'
                variant="solid"
                bg="#0071BC1A"
                color="#0071BC"
                size="md"
                onClick={handleDiscard}
                _hover={{
                  bg: '#005B8C',
                  color: 'white',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
                _active={{
                  bg: '#003F5E',
                  transform: 'scale(0.95)',
                }}
              >
                Discard
              </Button>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }} className='flex justify-end'>
              <Button
                width='100%'
                colorScheme="blue"
                size="md"
                type="submit"
                _hover={{
                  bg: '#005B8C',
                  transition: 'background-color 0.3s ease',
                }}
                _active={{
                  bg: '#003F5E',
                  transform: 'scale(0.95)',
                }}
              >
                Save Changes
              </Button>
            </GridItem>
          </Grid>
        </VStack>
      </form>
    </Box>
  );
};

export default ProfileEditForm;