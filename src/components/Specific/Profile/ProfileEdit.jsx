import React, { useContext, useState, useEffect } from 'react';
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
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormErrorMessage,
  InputRightElement,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/config';
import { UserdataContext } from '../../../App';
import axios from 'axios';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const ProfileEditForm = () => {
  const { userData, setUserData } = useContext(UserdataContext);
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      name: userData?.name,
      phone: userData?.phone?.slice(-10) || '',
      email: userData?.email,
      district: userData?.userLocation?.locationDistrict?.id || '',
      town: userData?.userLocation?.locationTown?.id || '',
    }
  });
  
  const navigate = useNavigate();
  const toast = useToast();
  const userToken = localStorage.getItem('UserToken');

  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);
  const [filteredTowns, setFilteredTowns] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(userData?.userLocation?.locationDistrict?.id || '');
  const [townSearchQuery, setTownSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/location-districts`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setDistricts(response.data.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, [userToken]);

  useEffect(() => {
    const fetchTowns = async () => {
      if (selectedDistrict) {
        try {
          const response = await axios.get(`${BASE_URL}/api/location-find-district-towns/${selectedDistrict}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          setTowns(response.data.data);
          setFilteredTowns(response.data.data);
        } catch (error) {
          console.error('Error fetching towns:', error);
        }
      }
    };
    fetchTowns();
  }, [selectedDistrict, userToken]);



  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', `+91${data.phone}`);

      console.log('Profile Update Data:', {
        name: data.name,
        email: data.email,
        phone: `+91${data.phone}`
      });

      const profileResponse = await fetch(`${BASE_URL}/api/auth/changeProfile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!profileResponse.ok) {
        const profileData = await profileResponse.json();
        throw new Error(profileData?.message || 'Failed to update profile');
      }

      if (data.district || data.town) {
        console.log('Location Update Data:', {
          locationDistrict: data.district,
          locationTown: data.town
        });

        const locationResponse = await fetch(`${BASE_URL}/api/update-user-location`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationDistrict: data.district,
            locationTown: data.town,
          }),
        });

        if (!locationResponse.ok) {
          const locationData = await locationResponse.json();
          throw new Error(locationData?.message || 'Failed to update location');
        }
      }

      toast({
        title: "Profile updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await fetchUserData();
      navigate('/');
      
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

  const getDefaultDistrictName = () => {
    const defaultDistrictId = userData?.userLocation?.locationDistrict?.id;
    const defaultDistrict = districts.find(district => district.id === defaultDistrictId);
    return defaultDistrict?.name || "Select district";
  };

  const getDefaultTownName = () => {
    const defaultTownId = userData?.userLocation?.locationTown?.id;
    const defaultTown = towns.find(town => town.id === defaultTownId);
    return defaultTown?.name || "Select town";
  };

  const handleTownSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setTownSearchQuery(query);
    
    const filtered = towns.filter(town => 
      town.name.toLowerCase().includes(query)
    );
    
    setFilteredTowns(filtered);
  };

  // Modify handleDistrictChange
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setTownSearchQuery(''); // Reset town search when district changes
    setFilteredTowns(towns); // Reset filtered towns
  };

  // Town selection handler
  const handleTownSelect = (townId) => {
    setValue('town', townId);
    setIsMenuOpen(false);
    setTownSearchQuery(''); // Optional: reset search query
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
                    placeholder={userData?.name}
                    border="1px"
                    borderColor="black"
                    _hover={{ borderColor: 'black' }}
                    _focus={{ borderColor: 'blue' }}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 7 }} />
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
                      placeholder={userData?.phone.slice(-10)}
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
                    placeholder={userData?.email}
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
            <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Location</Text>
            <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
              <GridItem colSpan={{ base: 12, md: 5 }}>
                <FormControl>
                  <Select
                    {...register("district")}
                    placeholder={getDefaultDistrictName()}
                    border="1px"
                    borderColor="black"
                    _hover={{ borderColor: 'black' }}
                    _focus={{ borderColor: 'blue' }}
                    onChange={handleDistrictChange}
                  >
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 7 }} />
              
              <GridItem colSpan={{ base: 12, md: 5 }}>
  <FormControl>
    <Controller
      name="town"
      control={control}
      render={({ field }) => (
        <Menu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          placement="bottom"
          strategy="fixed"
        >
          <MenuButton
            as={Button}
            rightIcon={<FaChevronDown />}
            width="100%"
            border="1px"
            borderColor="black"
            fontWeight='400'
            justifyContent="space-between"
            textAlign="left"
            bg="transparent"
            _hover={{ borderColor: 'black' }}
            onClick={() => setIsMenuOpen(true)}
            isDisabled={!selectedDistrict}
          >
            {field.value 
              ? towns.find(town => town.id === field.value)?.name || "Select town" 
              : getDefaultTownName()}
          </MenuButton>
          <MenuList 
            borderColor="black"
            boxShadow="md"
            maxH="300px"
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <Box p={2}>
              <InputGroup>
                <Input
                  placeholder="Search towns"
                  value={townSearchQuery}
                  onChange={handleTownSearch}
                  border="1px"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'blue.500' }}
                />
                <InputRightElement>
                  <FaSearch color="gray.500" />
                </InputRightElement>
              </InputGroup>
            </Box>
            {filteredTowns.length > 0 ? (
              filteredTowns.map((town) => (
                <MenuItem 
                  key={town.id} 
                  onClick={() => {
                    field.onChange(town.id);  // Use field.onChange to update form state
                    setIsMenuOpen(false);
                  }}
                >
                  {town.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem isDisabled>
                No towns found
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
    />
  </FormControl>
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