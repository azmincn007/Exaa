import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  Button, 
  Divider, 
  ModalFooter, 
  useToast, 
  FormControl,
  FormLabel,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Box
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { IMAGES } from "../../../constants/logoimg";
import { IoArrowBack } from "react-icons/io5";
import { Camera } from "lucide-react";

import CustomInput from "../../forms/Input/signup/CustomInput";
import MobileNumberInput from "../../forms/Input/signup/MobileNumberInput";
import AboutYouInput from "../../forms/Input/signup/AboutYouInput";
import { BASE_URL } from "../../../config/config";

function SignupModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    trigger,
    watch
  } = useForm();
  
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingTowns, setIsLoadingTowns] = useState(false);
  const [townSearchQuery, setTownSearchQuery] = useState('');

  const selectedTown = watch("locationTown");

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchTowns(selectedDistrict);
      setValue('locationTown', '');
      trigger('locationTown');
      setTownSearchQuery('');
    } else {
      setTowns([]);
      setValue('locationTown', '');
      trigger('locationTown');
    }
  }, [selectedDistrict, setValue, trigger]);

  const fetchDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/location-districts`);
      if (response.data.success) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast({
        title: "Error",
        description: "Could not load districts",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchTowns = async (districtId) => {
    setIsLoadingTowns(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/location-find-district-towns/${districtId}`);
      if (response.data.success) {
        setTowns(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching towns:", error);
      toast({
        title: "Error",
        description: "Could not load towns for selected district",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingTowns(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", `+91${data.phone}`);
      formData.append("description", data.aboutYou);
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const registerResponse = await axios.post(`${BASE_URL}/api/auth/local/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (registerResponse.data) {
        const jwtToken = registerResponse.data.data.jwt;

        const locationResponse = await axios.post(
          `${BASE_URL}/api/user-locations`,
          {
            locationDistrict: selectedDistrict,
            locationTown: data.locationTown,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        reset();
        setSelectedImage(null);
        setPreviewUrl(null);
        setSelectedDistrict("");

        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent className="bg-white p-4 rounded-lg font-Inter min-h-[450px]">
        <ModalHeader className="flex items-center justify-center">
          <img className="h-[35px] w-auto" src={IMAGES.ExaLogoBlack} alt="Exa Logo" />
        </ModalHeader>
        <Divider className="border-gray-300" />
        <ModalBody className="w-full mx-auto mb-8">
          <div className="absolute left-4 cursor-pointer" onClick={onClose}>
            <IoArrowBack className="h-[30px] w-[30px]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center mt-12 gap-4">
            <div className="relative group" onClick={handleImageClick}>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            <CustomInput 
              label="Name" 
              name="name" 
              register={register} 
              rules={{ required: "Name is required" }} 
              error={errors.name} 
            />
            <CustomInput
              label="Email"
              name="email"
              type="email"
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email}
            />
            <MobileNumberInput
              label="Mobile Number"
              name="phone"
              register={register}
              rules={{
                required: "Mobile number is required",
                validate: (value) => value.length === 10 || "Mobile number must be 10 digits",
              }}
              error={errors.phone}
            />
            <AboutYouInput 
              label="About You" 
              name="aboutYou" 
              register={register} 
              rules={{ maxLength: { value: 120, message: "Max length is 120 characters" } }} 
              error={errors.aboutYou} 
            />

            <FormControl isInvalid={!!errors.locationDistrict} mb={2}>
              <FormLabel>Select District</FormLabel>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingDistricts}
              >
                <option value="">Select a district</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </FormControl>

            <FormControl isInvalid={errors.locationTown} mb={4} className="z-50">
              <FormLabel>Select Town</FormLabel>
              <Controller
                name="locationTown"
                control={control}
                rules={{ 
                  validate: (value) => {
                    return selectedTown ? true : "Town is required"
                  }
                }}
                render={({ field }) => (
                  <Menu matchWidth>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaChevronDown className='h-3 w-3 text-black' />}
                      w="100%"
                      textAlign="left"
                      isDisabled={!selectedDistrict || isLoadingTowns}
                      className='border-black border-[1px] px-3'
                      fontWeight="normal"
                    >
                      {field.value 
                        ? towns.find(town => town.id.toString() === field.value)?.name 
                        : 'Select Town'}
                    </MenuButton>
                    <MenuList className="z-50" maxH="300px" overflowY="auto">
                      <Box p={2} >
                        <Input
                        
                          placeholder="Search town..."
                          value={townSearchQuery}
                          onChange={(e) => setTownSearchQuery(e.target.value)}
                          mb={2}
                        />
                      </Box>
                      {towns
                        .filter(town => 
                          town.name.toLowerCase().includes(townSearchQuery.toLowerCase())
                        )
                        .map((town) => (
                          <MenuItem
                            key={town.id}
                            onClick={() => {
                              field.onChange(town.id.toString());
                              setTownSearchQuery('');
                            }}
                            fontWeight="normal"
                          >
                            {town.name}
                          </MenuItem>
                        ))
                      }
                      {towns.filter(town => 
                        town.name.toLowerCase().includes(townSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <MenuItem isDisabled fontWeight="normal">
                          No towns found
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                )}
              />
              <FormErrorMessage>
                {errors.locationTown && errors.locationTown.message}
              </FormErrorMessage>
            </FormControl>

            <Button 
              type="submit" 
              className="w-full py-6 px-12" 
              colorScheme="blue" 
              isFullWidth 
              mt={4} 
              isDisabled={!selectedDistrict || !selectedTown}
            >
              Save And Continue
            </Button>
          </form>
        </ModalBody>
        <ModalFooter className="flex justify-end font-300 text-12 w-4/5 mx-auto text-center opacity-60">
          <div>
            All your personal details are safe with us. <br />
            By clicking continue, you agree to our <span className="text-exaBluetxt">Terms of Service and Privacy Policy</span>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SignupModal;