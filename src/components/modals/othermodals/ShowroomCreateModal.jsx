import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, Select, FormControl, FormLabel, FormErrorMessage, Box, Image, Icon, Flex, Text, useBreakpointValue, useToast, Textarea, Menu, MenuButton, MenuList, MenuItem, Input } from "@chakra-ui/react";
import { BASE_URL } from "../../../config/config";
import { IoAddOutline, IoClose } from "react-icons/io5";
import SellInput from "../../../components/forms/Input/SellInput.jsx";
import PhoneInputShowroom from "../../../components/forms/Input/MobileInputShowroom.jsx";
import { ChevronDownIcon } from 'lucide-react';
import { FaChevronDown } from "react-icons/fa";

const fetchCategories = async (userToken) => {
  const { data } = await axios.get(`${BASE_URL}/api/find-showroom-categories`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchSubCategories = async (userToken, categoryId) => {
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-category-showroom-categories/${categoryId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchShowroomCategories = async (userToken, subCategoryId) => {
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-showroom-category-sub-categories/${subCategoryId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchDistricts = async (userToken) => {
  const { data } = await axios.get(`${BASE_URL}/api/location-districts`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchTowns = async (userToken, districtId) => {
  const { data } = await axios.get(`${BASE_URL}/api/location-find-district-towns/${districtId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return data.data;
};

const ShowroomCreateModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [townSearchQuery, setTownSearchQuery] = useState('');
  const [uploadedLogo, setUploadedLogo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    setError,
    clearErrors,
  } = useForm();
  const [userToken, setUserToken] = useState(localStorage.getItem("UserToken"));
  const queryClient = useQueryClient();
  const toast = useToast();

  const createShowroomMutation = useMutation(
    (formData) =>
      axios.post(`${BASE_URL}/api/ad-showrooms`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }),
    {
      onSuccess: (response) => {
        console.log("Showroom created:", response.data.data);
        onSuccess(response.data.data);
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error("Error creating showroom:", error);
        toast({
          title: "Error creating showroom",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
      },
    }
  );

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });

  const categoriesQuery = useQuery(["adCategories", userToken], () => fetchCategories(userToken), {
    enabled: isOpen && !!userToken,
  });

  const subCategoriesQuery = useQuery(["adSubCategories", userToken, selectedCategoryId], () => fetchSubCategories(userToken, selectedCategoryId), {
    enabled: isOpen && !!userToken && !!selectedCategoryId,
  });

  const showroomCategoriesQuery = useQuery(["showroomCategories", userToken, selectedSubCategoryId], () => fetchShowroomCategories(userToken, selectedSubCategoryId), {
    enabled: isOpen && !!userToken && !!selectedSubCategoryId,
  });

  const districtsQuery = useQuery(["districts", userToken], () => fetchDistricts(userToken), {
    enabled: isOpen && !!userToken,
  });

  const townsQuery = useQuery(["towns", userToken, selectedDistrictId], () => fetchTowns(userToken, selectedDistrictId), {
    enabled: isOpen && !!userToken && !!selectedDistrictId,
  });

  const handleCategoryChange = useCallback(
    (e) => {
      const newCategoryId = e.target.value;
      setSelectedCategoryId(newCategoryId);
      setValue("adCategory", newCategoryId);
      setValue("adShowroomCategory", "");
      setValue("adSubCategory", "");
      setSelectedSubCategoryId(null);
    },
    [setValue]
  );

  const handleSubCategoryChange = useCallback(
    (e) => {
      const newSubCategoryId = e.target.value;
      setSelectedSubCategoryId(newSubCategoryId);
      setValue("adShowroomCategory", newSubCategoryId);
      setValue("adSubCategory", "");
    },
    [setValue]
  );

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + uploadedImages.length <= 10) {
      const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setUploadedImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index);
      return newImages;
    });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedLogo({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removeLogo = () => {
    setUploadedLogo(null);
  };

  const onSubmit = useCallback(
    async (data) => {
      if (isSubmitting) return;

      if (uploadedImages.length === 0) {
        setError('images', {
          type: 'required',
          message: 'At least upload a single image'
        });
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "phone" || key === "whatsappNumber") {
          formData.append(key, `+91${data[key]}`);
        } else {
          formData.append(key, data[key]);
        }
      });

      uploadedImages.forEach(image => {
        formData.append("images", image.file);
      });

      if (uploadedLogo) {
        formData.append("logo", uploadedLogo.file);
      }

      try {
        await createShowroomMutation.mutateAsync(formData);
      } catch (error) {
        console.error("Error in onSubmit:", error);
        setIsSubmitting(false);
      }
    },
    [createShowroomMutation, uploadedImages, uploadedLogo, isSubmitting, setError]
  );

  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setSelectedDistrictId(null);
      setUploadedImages([]);
      setUserToken(localStorage.getItem("UserToken"));
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) {
      setTownSearchQuery('');
    }
  }, [isOpen]);

  const ImageUploadBox = ({ onClick, children }) => (
    <Box w={imageBoxSize} h={imageBoxSize} backgroundColor="#4F7598" border="2px" borderColor="gray.300" borderRadius="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center" cursor="pointer" color="white" onClick={onClick}>
      {children}
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent 
        bg="#F1F1F1" 
        color="black" 
        maxWidth={{ base: "80%", md: modalSize }}
        position="relative"
      >
        <Icon 
          as={IoClose} 
          w={6} 
          h={6} 
          color="gray.500" 
          onClick={onClose} 
          position="absolute" 
          top={4} 
          right={4} 
          cursor="pointer" 
        />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 py-3">
            <h3 className={`text-${headingSize} font-bold mb-3`}>Create New Showroom</h3>

            <SellInput label="Name" type="text" name="name" register={register} rules={{ required: "Name is required" }} error={errors.name} fontSize={fontSize} />

            <FormControl isInvalid={errors.phone}>
              <FormLabel fontSize={fontSize}>Mobile Number</FormLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Invalid mobile number",
                  },
                }}
                render={({ field }) => <PhoneInputShowroom {...field} error={errors.phone} />}
              />
              <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.whatsappNumber}>
              <FormLabel fontSize={fontSize}>WhatsApp Number</FormLabel>
              <Controller
                name="whatsappNumber"
                control={control}
                rules={{
                  required: "WhatsApp number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Invalid WhatsApp number",
                  },
                }}
                render={({ field }) => <PhoneInputShowroom {...field} error={errors.whatsappNumber} />}
              />
              <FormErrorMessage>{errors.whatsappNumber && errors.whatsappNumber.message}</FormErrorMessage>
            </FormControl>

            <SellInput label="Address" type="text" name="address" register={register} rules={{ required: "Address is required" }} error={errors.address} fontSize={fontSize} />

            <FormControl isInvalid={errors.description}>
              <FormLabel fontSize={fontSize}>Description</FormLabel>
              <Textarea {...register("description", { required: "Description is required" })} placeholder="Enter showroom description" fontSize={fontSize} className="border-black" />
              <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
            </FormControl>

            <SellInput
              label="Website Link"
              type="url"
              name="websiteLink"
              register={register}
              rules={{
                pattern: {
                  value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: "Invalid URL format",
                },
              }}
              error={errors.websiteLink}
              fontSize={fontSize}
            />

            <SellInput
              label="Facebook Page Link"
              name="facebookPageLink"
              register={register}
              rules={{
                pattern: {
                  message: "Invalid Facebook page URL",
                },
              }}
              error={errors.facebookPageLink}
              fontSize={fontSize}
            />

            <FormControl isInvalid={errors.adCategory} fontSize={fontSize}>
              <FormLabel>Category</FormLabel>
              <Select className="border-black" placeholder="Select Category" isDisabled={categoriesQuery.isLoading} {...register("adCategory", { required: "Category is required" })} onChange={handleCategoryChange}>
                {categoriesQuery.data?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.adCategory && errors.adCategory.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.adShowroomCategory} fontSize={fontSize}>
              <FormLabel>Showroom Category</FormLabel>
              <Select
                className="border-black"
                placeholder="Select Showroom Category"
                isDisabled={!selectedCategoryId || subCategoriesQuery.isLoading}
                {...register("adShowroomCategory", { required: "Showroom Category is required" })}
                onChange={handleSubCategoryChange}
              >
                {subCategoriesQuery.data?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.adShowroomCategory && errors.adShowroomCategory.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.adSubCategory} fontSize={fontSize}>
              <FormLabel>Sub Category</FormLabel>
              <Select className="border-black" placeholder="Select Sub Category" isDisabled={!selectedSubCategoryId || showroomCategoriesQuery.isLoading} {...register("adSubCategory", { required: "Sub Category is required" })}>
                {showroomCategoriesQuery.data?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.adSubCategory && errors.adSubCategory.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.locationDistrict} fontSize={fontSize}>
              <FormLabel>District</FormLabel>
              <Select
                className="border-black"
                placeholder="Select District"
                isDisabled={districtsQuery.isLoading}
                {...register("locationDistrict", { required: "District is required" })}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  setValue("locationTown", "");
                }}
              >
                {districtsQuery.data?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.locationDistrict && errors.locationDistrict.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.locationTown} fontSize={fontSize}>
              <FormLabel>Town</FormLabel>
              <Controller
                name="locationTown"
                control={control}
                rules={{ required: "Town is required" }}
                render={({ field }) => (
                  <Menu matchWidth>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaChevronDown  className='h-3 w-3 text-black ' />}
                      w="100%"
                      textAlign="left"
                      isDisabled={!selectedDistrictId || townsQuery.isLoading}
                      className='border-black border-[1px] px-3'
                      fontWeight="normal"
                    >
                      {field.value ? 
                        townsQuery.data?.find(opt => opt.id.toString() === field.value)?.name || 'Select Town' 
                        : 'Select Town'
                      }
                    </MenuButton>
                    <MenuList maxH="200px" overflowY="auto">
                      <Box p={2}>
                        <Input
                          placeholder="Search town..."
                          value={townSearchQuery}
                          onChange={(e) => setTownSearchQuery(e.target.value)}
                          mb={2}
                        />
                      </Box>
                      {townsQuery.data
                        ?.filter(option => 
                          option.name?.toLowerCase().includes(townSearchQuery.toLowerCase())
                        )
                        .map(option => (
                          <MenuItem
                            key={option.id}
                            value={option.id}
                            onClick={() => {
                              field.onChange(option.id.toString());
                              setTownSearchQuery('');
                            }}
                            fontWeight="normal"
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                      {!townsQuery.data?.filter(option => 
                        option.name?.toLowerCase().includes(townSearchQuery.toLowerCase())
                      ).length && (
                        <MenuItem isDisabled fontWeight="normal">No towns found</MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                )}
              />
              <FormErrorMessage>{errors.locationTown && errors.locationTown.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.images} fontSize={fontSize}>
              <FormLabel>Upload Images (Max 10)</FormLabel>
              <Flex gap={3} flexWrap="wrap" justifyContent="center">
                {uploadedImages.map((image, index) => (
                  <Box key={index} position="relative" width="30%">
                    <ImageUploadBox>
                      <Image src={image.preview} alt={`Uploaded ${index + 1}`} objectFit="cover" w="100%" h="100%" />
                      <IoClose
                        className="absolute top-1 right-3 bg-[#4F7598] rounded-full h-[20px] w-[20px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      />
                    </ImageUploadBox>
                    <Text as="a" fontSize="xs" textAlign="center" mt={1}>
                      Uploaded
                    </Text>
                  </Box>
                ))}
                {uploadedImages.length < 10 && (
                  <ImageUploadBox onClick={() => document.getElementById("imageUpload").click()}>
                    <Icon as={IoAddOutline} w={5} h={5} />
                    <Text fontSize="xs" textAlign="center" mt={1}>
                      {uploadedImages.length === 0 ? 'Add image' : 'Upload more'}
                    </Text>
                  </ImageUploadBox>
                )}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </Flex>
              {errors.images && (
                <FormErrorMessage>
                  {errors.images.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.logo} fontSize={fontSize}>
              <FormLabel>Upload Logo (Optional)</FormLabel>
              <Flex gap={3} flexWrap="wrap" justifyContent="center">
                {uploadedLogo && (
                  <Box position="relative" width="30%">
                    <ImageUploadBox>
                      <Image src={uploadedLogo.preview} alt="Uploaded Logo" objectFit="cover" w="100%" h="100%" />
                      <IoClose
                        className="absolute top-1 right-3 bg-[#4F7598] rounded-full h-[20px] w-[20px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLogo();
                        }}
                      />
                    </ImageUploadBox>
                    <Text as="a" fontSize="xs" textAlign="center" mt={1}>
                      Uploaded Logo
                    </Text>
                  </Box>
                )}
                {!uploadedLogo && (
                  <ImageUploadBox onClick={() => document.getElementById("logoUpload").click()}>
                    <Icon as={IoAddOutline} w={5} h={5} />
                    <Text fontSize="xs" textAlign="center" mt={1}>
                      Add Logo
                    </Text>
                  </ImageUploadBox>
                )}
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoUpload}
                />
              </Flex>
              {errors.logo && (
                <FormErrorMessage>
                  {errors.logo.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="blue" 
              mt={3} 
              fontSize={fontSize}
              isLoading={isSubmitting}
              loadingText="Creating..."
              disabled={isSubmitting}
            >
              Create Showroom
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShowroomCreateModal;
