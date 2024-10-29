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
import { useCategories, useDistricts, useSubCategories, fetchSubCategoryDetails, useTowns } from '../../common/config/SellModalQueries.jsx';
import { useBrands } from '../../common/config/Api/UseBrands.jsx';
import { useModels } from '../../common/config/Api/UseModels.jsx';
import { useVariants } from '../../common/config/Api/UseVarient.jsx';
import { useNavigate } from 'react-router-dom';

const SellModalEdit = ({ isOpen, onClose, listingData }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  const [completeAdData, setCompleteAdData] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [categoryChanged, setCategoryChanged] = useState(false);
  const [initialCategoryId, setInitialCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, setValue, getValues, reset } = useForm();
  const getUserToken = useCallback(() => localStorage.getItem('UserToken'), []);
  const toast = useToast();
  const navigate = useNavigate();

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories(isOpen, getUserToken);
  const { data: subCategories, isLoading: isSubCategoriesLoading } = useSubCategories(isOpen, getUserToken, selectedCategoryId);
  const { data: districts, isLoading: isDistrictsLoading } = useDistricts(isOpen, getUserToken);
  const { data: towns, isLoading: isTownsLoading } = useTowns(isOpen, getUserToken, selectedDistrictId);
  const { data: brands, isLoading: isBrandsLoading } = useBrands(isOpen, getUserToken, selectedSubCategoryId);
  const { data: models, isLoading: isModelsLoading } = useModels(isOpen, getUserToken, selectedBrandId, selectedSubCategoryId);
  const { data: variants, isLoading: isVariantsLoading } = useVariants(isOpen, getUserToken, selectedModelId, selectedSubCategoryId);

  const fetchCompleteAdData = async (userToken, adCategoryId, adId) => {
    if (!userToken || !adCategoryId || !adId) return null;
    const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`, {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    return data.data;
  };

  const { data: completeAd, isLoading: isCompleteAdLoading, error: completeAdError } = useQuery(
    ['completeAd', getUserToken(), listingData?.adCategory?.id, listingData?.id],
    () => fetchCompleteAdData(getUserToken(), listingData?.adCategory?.id, listingData?.id),
    { 
      enabled: isOpen && !!getUserToken() && !!listingData?.adCategory?.id && !!listingData?.id,
      onSuccess: (data) => {
        setCompleteAdData(data);
        setIsDataLoaded(true);
      },
      onError: (error) => {
        console.error('Error fetching complete ad data:', error);
        toast({
          title: "Error loading ad data",
          description: "Please try again later",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  );

  useEffect(() => {
    if (isDataLoaded && completeAdData) {
      setInitialCategoryId(completeAdData.adCategory?.id);
      setSelectedCategoryId(completeAdData.adCategory?.id);
      setSelectedSubCategoryId(completeAdData.adSubCategory?.id);
      setSelectedDistrictId(completeAdData.locationDistrict?.id);
      setSelectedBrandId(completeAdData.brand?.id);
      setSelectedModelId(completeAdData.model?.id);
      setSelectedVariantId(completeAdData.variant?.id);

      // Set form values for all fields
      Object.entries(completeAdData).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          setValue(key, value);
        }
      });

      // Set form values for objects
      setValue('adCategory', completeAdData.adCategory?.id);
      setValue('adSubCategory', completeAdData.adSubCategory?.id);
      setValue('locationDistrict', completeAdData.locationDistrict?.id);
      setValue('locationTown', completeAdData.locationTown?.id);
      setValue('brand', completeAdData.brand?.id);
      setValue('model', completeAdData.model?.id);
      setValue('variant', completeAdData.variant?.id);

      // Handle images
      const images = Array.isArray(completeAdData.images) 
        ? completeAdData.images 
        : completeAdData.images 
          ? [completeAdData.images] 
          : [];

      setUploadedImages(images.map(img => ({ 
        file: null, 
        preview: typeof img === 'string' ? img : `${BASE_URL}${img.url}`,
        isExisting: true
      })));
    }
  }, [isDataLoaded, completeAdData, setValue]);

  useEffect(() => {
    if (selectedSubCategoryId) {
      fetchSubCategoryDetails(getUserToken(), selectedSubCategoryId)
        .then(setSubCategoryDetails)
        .catch(console.error);
    }
  }, [selectedSubCategoryId, getUserToken]);

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setCategoryChanged(newCategoryId !== initialCategoryId);
    setSelectedCategoryId(newCategoryId);
    setSelectedSubCategoryId(null);
    setSubCategoryDetails(null);
    setValue('adCategory', newCategoryId);
    setValue('adSubCategory', '');
    // Clear dependent fields
    setValue('brand', '');
    setValue('model', '');
    setValue('variant', '');
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSelectedVariantId(null);
  };

  const handleSubCategoryChange = (e) => {
    const newSubCategoryId = e.target.value;
    setSelectedSubCategoryId(newSubCategoryId);
    setValue('adSubCategory', newSubCategoryId);
    // Clear dependent fields
    setValue('brand', '');
    setValue('model', '');
    setValue('variant', '');
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSelectedVariantId(null);
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

  const checkAdCreationPossibility = async (categoryId) => {
    try {
      const token = getUserToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BASE_URL}/api/ad-categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.data.isAdCreationPossible;
    } catch (error) {
      console.error('Error checking ad creation possibility:', error);
      toast({
        title: "Error checking category permission",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      if (categoryChanged) {
        const isCreationPossible = await checkAdCreationPossibility(data.adCategory);
        
        if (!isCreationPossible) {
          onClose();
          navigate('/packages/post-more-ads');
          toast({
            title: "Package Required",
            description: "You need to purchase a package to edit ads in this category. Redirecting you to available packages.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
          setIsSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      const alwaysIncludeFields = ['brand', 'model', 'variant', 'type'];

      Object.keys(data).forEach(key => {
        // Include if it's in alwaysIncludeFields list, even if empty
        if (alwaysIncludeFields.includes(key)) {
          formData.append(key, data[key] || ''); // Use empty string if value is null/undefined
        } else if (data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      formData.append('adShowroom', JSON.stringify([]));
      formData.append('adBoostTag', '');

      if (uploadedImages.length === 0) {
        throw new Error('At least one image is required');
      }

      const imagePromises = uploadedImages.map(async (image, index) => {
        if (image.file) {
          return image.file;
        } else if (image.isExisting) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const renderField = (fieldName) => {
    const config = getFieldConfig(fieldName, districts, towns, brands, models, variants);
    if (!config) return null;

    switch(config.type) {
      case 'radio':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Controller
              name={fieldName}
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <RadioGroup onChange={onChange} value={value}>
                  <Stack direction="row" spacing={4}>
                    {config.options.map(option => (
                      <Radio key={option} value={option}>
                        {option}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              )}
            />
            <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Select 
              {...register(fieldName, config.rules)}
              isDisabled={
                fieldName === 'locationDistrict' ? isDistrictsLoading : 
                fieldName === 'locationTown' ? isTownsLoading || !selectedDistrictId :
                fieldName === 'brand' ? isBrandsLoading :
                fieldName === 'model' ? isModelsLoading || !selectedBrandId :
                fieldName === 'variant' ? isVariantsLoading || !selectedModelId :
                false
              }
              onChange={(e) => {
                const newValue = e.target.value;
                setValue(fieldName, newValue);

                if (fieldName === 'locationDistrict') {
                  setSelectedDistrictId(newValue);
                  setValue('locationTown', '');
                } else if (fieldName === 'brand') {
                  setSelectedBrandId(newValue);
                  setValue('model', '');
                  setValue('variant', '');
                  setSelectedModelId(null);
                  setSelectedVariantId(null);
                } else if (fieldName === 'model') {
                  setSelectedModelId(newValue);
                  setValue('variant', '');
                  setSelectedVariantId(null);
                } else if (fieldName === 'variant') {
                  setSelectedVariantId(newValue);
                }
              }}
              value={
                fieldName === 'locationDistrict' ? selectedDistrictId || '' :
                fieldName === 'brand' ? selectedBrandId || '' :
                fieldName === 'model' ? selectedModelId || '' :
                fieldName === 'variant' ? selectedVariantId || '' :
                getValues(fieldName) || ''
              }
            >
              <option value="">Select {config.label}</option>
              {config.options?.map(option => (
                <option key={option.id || option} value={option.id || option}>
                  {option.name || option}
                </option>
              ))}
            </Select>
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
          ) : completeAdError ? (
            <Text color="red.500">Error loading ad data. Please try again.</Text>
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
              
              <Button 
                type="submit" 
                colorScheme="blue" 
                mt={3} 
                fontSize={fontSize}
                isLoading={isSubmitting}
                loadingText="Updating..."
                disabled={isSubmitting}
              >
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
}
  export default SellModalEdit
