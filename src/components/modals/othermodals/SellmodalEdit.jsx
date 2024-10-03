import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  RadioGroup,
  Radio,
  Stack,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Image,
  Icon,
  Flex,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { IoAddOutline, IoClose } from 'react-icons/io5';
import { BASE_URL } from '../../../config/config';
import SellInput from '../../../components/forms/Input/SellInput.jsx';
import getFieldConfig from '../../common/config/GetField.jsx';

// API functions
const fetchCategories = async (userToken) => {
  if (!userToken) throw new Error('No user token found');
  const { data } = await axios.get(`${BASE_URL}/api/ad-categories`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchSubCategories = async (userToken, categoryId) => {
  if (!userToken) throw new Error('No user token found');
  if (!categoryId) throw new Error('No category selected');
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-category-sub-categories/${categoryId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchSubCategoryDetails = async (userToken, subCategoryId) => {
  if (!userToken) throw new Error('No user token found');
  if (!subCategoryId) throw new Error('No subcategory selected');
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${subCategoryId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchDistricts = async (userToken) => {
  if (!userToken) throw new Error('No user token found');
  const { data } = await axios.get(`${BASE_URL}/api/location-districts`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchTowns = async (userToken, districtId) => {
  if (!userToken) throw new Error('No user token found');
  if (!districtId) throw new Error('No district selected');
  const { data } = await axios.get(`${BASE_URL}/api/location-find-district-towns/${districtId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchCompleteAdData = async (userToken, adCategoryId, adId) => {
  if (!userToken) throw new Error('No user token found');
  if (!adCategoryId) throw new Error('No category ID provided');
  if (!adId) throw new Error('No ad ID provided');
  const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const SellModalEdit = ({ isOpen, onClose, listingData }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  const [completeAdData, setCompleteAdData] = useState(null);

  
  const { register, handleSubmit, control, formState: { errors }, setValue, reset, getValues } = useForm();
  const getUserToken = useCallback(() => localStorage.getItem('UserToken'), []);
  const toast = useToast();

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery(
    ['adCategories', getUserToken()],
    () => fetchCategories(getUserToken()),
    { enabled: isOpen && !!getUserToken() }
  );

  const { data: subCategories, isLoading: isSubCategoriesLoading } = useQuery(
    ['adSubCategories', getUserToken(), selectedCategoryId],
    () => fetchSubCategories(getUserToken(), selectedCategoryId),
    { enabled: isOpen && !!getUserToken() && !!selectedCategoryId }
  );

  const { data: districts, isLoading: isDistrictsLoading } = useQuery(
    ['districts', getUserToken()],
    () => fetchDistricts(getUserToken()),
    { enabled: isOpen && !!getUserToken() }
  );

  const { data: towns, isLoading: isTownsLoading } = useQuery(
    ['towns', getUserToken(), selectedDistrictId],
    () => fetchTowns(getUserToken(), selectedDistrictId),
    { enabled: isOpen && !!getUserToken() && !!selectedDistrictId }
  );

  const { data: completeAd, isLoading: isCompleteAdLoading } = useQuery(
    ['completeAd', getUserToken(), listingData?.adCategory?.id, listingData?.id],
    () => fetchCompleteAdData(getUserToken(), listingData?.adCategory?.id, listingData?.id),
    { 
      enabled: isOpen && !!getUserToken() && !!listingData?.adCategory?.id && !!listingData?.id,
      onSuccess: (data) => {
        setCompleteAdData(data);
      }
    }
  );

  useEffect(() => {
    if (listingData) {
      setSelectedCategoryId(listingData.adCategory?.id);
      setSelectedSubCategoryId(listingData.adSubCategory?.id);
      setSelectedDistrictId(listingData.locationDistrict?.id);
      
      const images = Array.isArray(listingData.images) 
        ? listingData.images 
        : listingData.images 
          ? [listingData.images] 
          : [];

      setUploadedImages(images.map(img => ({ 
        file: null, 
        preview: typeof img === 'string' ? img : `${BASE_URL}${img.url}`,
        isExisting: true
      })));
    }
  }, [listingData]);

  useEffect(() => {
    if (completeAdData) {
      Object.entries(completeAdData).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          setValue(key, value);
        }
      });
      setValue('adCategory', completeAdData.adCategory?.id);
      setValue('adSubCategory', completeAdData.adSubCategory?.id);
      setValue('locationDistrict', completeAdData.locationDistrict?.id);
      setValue('locationTown', completeAdData.locationTown?.id);
    }
  }, [completeAdData, setValue]);

  useEffect(() => {
    if (selectedSubCategoryId) {
      fetchSubCategoryDetails(getUserToken(), selectedSubCategoryId)
        .then(setSubCategoryDetails)
        .catch(console.error);
    }
  }, [selectedSubCategoryId, getUserToken]);

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setSelectedCategoryId(newCategoryId);
    setSelectedSubCategoryId(null);
    setSubCategoryDetails(null);
    setValue('adCategory', newCategoryId);
    setValue('adSubCategory', '');
  };

  const handleSubCategoryChange = (e) => {
    const newSubCategoryId = e.target.value;
    setSelectedSubCategoryId(newSubCategoryId);
    setValue('adSubCategory', newSubCategoryId);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && uploadedImages.length < 4) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prevImages => [...prevImages, { file, preview: reader.result, isExisting: false }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      formData.append('adShowroom', JSON.stringify([]));

      // Handle image uploads
      if (uploadedImages.length === 0) {
        throw new Error('At least one image is required');
      }

      const imagePromises = uploadedImages.map(async (image, index) => {
        if (image.file) {
          // New image upload
          return image.file;
        } else if (image.isExisting) {
          // Existing image
          const response = await fetch(image.preview);
          const blob = await response.blob();
          return new File([blob], `existing_image_${index}.jpg`, { type: 'image/jpeg' });
        }
      });

      const imageFiles = await Promise.all(imagePromises);

      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });

      const token = getUserToken();
      if (!token) throw new Error('No authentication token found');

      console.log('Data being sent to update ad API:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const apiEndpoint = subCategoryDetails?.apiUrl 
        ? `${BASE_URL}/api/${subCategoryDetails.apiUrl}/${listingData.id}`
        : `${BASE_URL}/api/update-ad/${listingData.id}`;

      const response = await axios.put(apiEndpoint, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('API Response:', response.data);
        toast({
          title: "Ad updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error('Failed to update ad');
      }
    } catch (error) {
      console.error('Error updating ad:', error);
      toast({
        title: "Error updating ad",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderField = (fieldName) => {
    const config = getFieldConfig(fieldName, districts, towns);
    if (!config) return null;

    switch(config.type) {
      case 'select':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Select 
              {...register(fieldName, config.rules)}
              isDisabled={fieldName === 'locationDistrict' ? isDistrictsLoading : (fieldName === 'locationTown' ? isTownsLoading || !selectedDistrictId : false)}
              onChange={(e) => {
                if (fieldName === 'locationDistrict') {
                  setSelectedDistrictId(e.target.value);
                  setValue('locationTown', '');
                }
              }}
            >
              <option value="">Select {config.label}</option>
              {config.options.map(option => (
                <option key={option.id || option} value={option.id || option}>{option.name || option}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
          </FormControl>
        );
      case 'radio':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Controller
              name={fieldName}
              control={control}
              rules={config.rules}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <Stack direction="row">
                    {config.options.map(option => (
                      <Radio key={option} value={option}>{option}</Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              )}
            />
            <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControl key={fieldName} fontSize={fontSize}>
            <Checkbox {...register(fieldName)}>{config.label}</Checkbox>
          </FormControl>
        );
      default:
        return (
          <SellInput
            key={fieldName}
            label={config.label}
            type={config.type}
            name={fieldName}
            register={register}
            rules={config.rules}
            error={errors[fieldName]}
            fontSize={fontSize}
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent bg="#F1F1F1" color="black">
        <ModalBody>
          {isCompleteAdLoading ? (
            <Text>Loading ad data...</Text>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 py-3'>
              <h3 className={`text-${headingSize} font-bold mb-3`}>Edit your ad</h3>
              
              <FormControl isInvalid={errors.adCategory} fontSize={fontSize}>
                <FormLabel>Category</FormLabel>
                <Select 
                  {...register('adCategory', { required: 'Category is required' })}
                  onChange={handleCategoryChange}
                  value={selectedCategoryId || ''}
                  isDisabled={isCategoriesLoading}
                >
                  <option value="">Select Category</option>
                  {categories?.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.adCategory?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.adSubCategory} fontSize={fontSize}>
                <FormLabel>Sub-Category</FormLabel>
                <Select 
                  {...register('adSubCategory', { required: 'Sub-category is required' })}
                  onChange={handleSubCategoryChange}
                  value={selectedSubCategoryId || ''}
                  isDisabled={isSubCategoriesLoading || !selectedCategoryId}
                >
                  <option value="">Select Sub-Category</option>
                  {subCategories?.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.adSubCategory?.message}</FormErrorMessage>
              </FormControl>
              
              {subCategoryDetails && subCategoryDetails.requiredFields?.map(fieldName => renderField(fieldName))}
              
                 <FormControl fontSize={fontSize}>
                <FormLabel>Images (Max 4)</FormLabel>
                <Flex gap={3} flexWrap="wrap" justifyContent="center">
                  {uploadedImages.map((image, index) => (
                    <Box key={index} position="relative">
                      <Box
                        w={imageBoxSize}
                        h={imageBoxSize}
                        backgroundColor='#4F7598'
                        border="2px"
                        borderColor="gray.300"
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <Image src={image.preview} alt={`Uploaded ${index + 1}`} objectFit="cover" w="100%" h="100%" />
                        <Icon
                          as={IoClose}
                          position="absolute"
                          top={1}
                          right={1}
                          bg="#4F7598"
                          color="white"
                          borderRadius="full"
                          boxSize={5}
                          cursor="pointer"
                          onClick={() => removeImage(index)}
                        />
                      </Box>
                    </Box>
                  ))}
                  {uploadedImages.length < 4 && (
                    <Box
                      w={imageBoxSize}
                      h={imageBoxSize}
                      backgroundColor='#4F7598'
                      border="2px"
                      borderColor="gray.300"
                      borderRadius="md"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      color='white'
                      onClick={() => document.getElementById('imageUpload').click()}
                    >
                      <Icon as={IoAddOutline} w={5} h={5} />
                      <Text fontSize="xs" textAlign="center" mt={1}>
                        {uploadedImages.length === 0 ? 'Add image' : 'Upload more'}
                      </Text>
                    </Box>
                  )}
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </Flex>
              </FormControl>
              
              <Button type="submit" colorScheme="blue" mt={3} fontSize={fontSize}>
                Update Ad
              </Button>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose} fontSize={fontSize}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SellModalEdit;