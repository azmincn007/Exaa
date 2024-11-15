import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, NumberInput, NumberInputField, Checkbox, RadioGroup, 
  Radio, Stack, useToast, VStack, FormErrorMessage, Box, Flex, 
  Image, Icon, Text, useBreakpointValue, Select, Spinner, Center
} from '@chakra-ui/react';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import { useForm, Controller } from 'react-hook-form';
import getFieldConfig from '../../common/config/GetField';
import { IoAddOutline, IoClose } from 'react-icons/io5';
import { useBrands } from '../../common/config/Api/UseBrands.jsx';
import { useModels } from '../../common/config/Api/UseModels.jsx';
import { useVariants } from '../../common/config/Api/UseVarient.jsx';
import { useTypes } from '../../common/config/Api/UseTypes.jsx';
import { LogIn } from 'lucide-react';
import TestModal from './TestModal';
import { useQueryClient } from 'react-query';


const EditShowroomad = ({ 
  isOpen, 
  onClose, 
  ad, 
  onSuccess, 
  categoryId, 
  subCategoryId, 
  districtId, 
  townId, 
  showroomId,
  onShowSuccess 
}) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [adData, setAdData] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const toast = useToast();
  const { register, handleSubmit, control, formState: { errors }, setValue, watch, getValues } = useForm();
  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });
  const token = localStorage.getItem('UserToken');
  const getUserToken = useCallback(() => localStorage.getItem('UserToken'), []);

  // Add new state to track if these fields are needed
  const [requiredFields, setRequiredFields] = useState({
    brand: false,
    model: false,
    variant: false,
    type: false
  });

  // Modify the API hooks to include the required field check
  const { data: brands } = useBrands(
    isOpen, 
    getUserToken, 
    subCategoryId,
    subCategoryId === 18 ? selectedTypeId : null
  );
  const { data: models } = useModels(
    isOpen, 
    getUserToken, 
    selectedBrandId, 
    subCategoryId,
    subCategoryId === 18 ? selectedTypeId : null
  );
  const { data: variants } = useVariants(isOpen, getUserToken, selectedModelId, subCategoryId);
  const { data: types } = useTypes(isOpen, getUserToken, subCategoryId);


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const queryClient = useQueryClient();

  const [boostTags, setBoostTags] = useState([]);
  const [selectedBoostTag, setSelectedBoostTag] = useState('');
console.log(selectedBoostTag);

  useEffect(() => {
    const fetchBoostTags = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/ad-boost-tags`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setBoostTags(response.data.data);
          
          // If there's an existing boost tag in the ad data, set it
          if (adData?.adBoostTag) {
            const boostTagId = typeof adData.adBoostTag === 'object' 
              ? adData.adBoostTag.id 
              : adData.adBoostTag;
            setSelectedBoostTag(boostTagId);
            setValue('adBoostTag', boostTagId);
          }
        }
      } catch (error) {
        console.error('Error fetching boost tags:', error);
      }
    };

    if (isOpen) {
      fetchBoostTags();
    }
  }, [isOpen, token, adData, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (!ad?.id || !token || !subCategoryId) return;

      try {
        setIsDataLoaded(false);
        const [subCategoryResponse, adResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${subCategoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/find-one-ad/${categoryId}/${ad.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (subCategoryResponse.data.success) {
          const subCategoryData = subCategoryResponse.data.data;
          setSubCategoryDetails(subCategoryData);
          
          // Check which fields are required based on the subcategory
          const fields = subCategoryData.fields || [];
          setRequiredFields({
            brand: fields.includes('brand'),
            model: fields.includes('model'),
            variant: fields.includes('variant'),
            type: fields.includes('type')
          });
        }

        if (adResponse.data.success) {
          const filteredData = { ...adResponse.data.data };
          console.log('Fetched ad data:', filteredData);
          
          setUploadedImages(filteredData.images?.map(img => ({
            file: null,
            preview: `${BASE_URL}${img.url}`,
            isExisting: true,
            id: img.id
          })) || []);
          
          const fieldsToRemove = ['adCategory', 'adSubCategory', 'locationDistrict', 'locationTown', 
            'adFavouriteCount', 'adViewCount', 'adSeller', 'adBuyer', 'createdAt', 
            'updatedAt', 'isAdFavourite', 'images'];
          fieldsToRemove.forEach(field => delete filteredData[field]);
          
          setAdData(filteredData);
          Object.keys(filteredData).forEach(key => setValue(key, filteredData[key]));
          
          const brandId = filteredData.brand?.id || filteredData.brand;
          const modelId = filteredData.model?.id || filteredData.model;
          const typeId = filteredData.type?.id || filteredData.type;
          const variantId = filteredData.variant?.id || filteredData.variant;

          setSelectedBrandId(brandId);
          setSelectedModelId(modelId);
          setSelectedTypeId(typeId);
          setSelectedVariantId(variantId);

          setValue('brand', brandId);
          setValue('model', modelId);
          setValue('type', typeId);
          setValue('variant', variantId);

          Object.keys(filteredData).forEach(key => {
            if (key !== 'brand' && key !== 'model' && key !== 'type' && key !== 'variant') {
              setValue(key, filteredData[key]);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsDataLoaded(true);
      }
    };

    fetchData();
  }, [ad, categoryId, subCategoryId, token, setValue]);

  useEffect(() => {
    console.log('Brands:', brands);
    console.log('Selected Brand ID:', selectedBrandId);
    console.log('Brand Form Value:', getValues('brand'));
  }, [brands, selectedBrandId, getValues]);

  useEffect(() => {
    if (selectedBrandId) {
      setValue('brand', selectedBrandId);
    }
  }, [selectedBrandId, setValue]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && uploadedImages.length < 10) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, { file, preview: reader.result, isExisting: false }]);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: 'Maximum images reached',
        description: 'You can only upload up to 10 images',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderField = (fieldName) => {
    if (fieldName === 'locationDistrict' || fieldName === 'locationTown' || fieldName === 'adBoostTag') {
      return null;
    }

    const config = getFieldConfig(fieldName, [], [], brands, models, variants, types);
    if (!config) return null;

    const CommonWrapper = ({ children }) => (
      <FormControl key={fieldName} isInvalid={errors[fieldName]}>
        <FormLabel fontSize={fontSize}>{config.label}</FormLabel>
        {children}
        <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
      </FormControl>
    );

    switch (config.type) {
      case 'text':
      case 'number':
        return (
          <CommonWrapper>
            <Input {...register(fieldName, config.rules)} fontSize={fontSize} type={config.type} />
          </CommonWrapper>
        );
      case 'select':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Select 
              {...register(fieldName, config.rules)}
              onChange={(e) => {
                const newValue = e.target.value;
                setValue(fieldName, newValue, { shouldValidate: true });
                
                // Handle special cases for dependent fields
                switch(fieldName) {
                  case 'type':
                    setSelectedTypeId(newValue);
                    if (subCategoryId === 18) {
                      setValue('brand', '');
                      setValue('model', '');
                      setValue('variant', '');
                      setSelectedBrandId(null);
                      setSelectedModelId(null);
                      setSelectedVariantId(null);
                    }
                    break;
                  case 'brand':
                    setSelectedBrandId(newValue);
                    setValue('model', '');
                    setValue('variant', '');
                    setSelectedModelId(null);
                    setSelectedVariantId(null);
                    break;
                  case 'model':
                    setSelectedModelId(newValue);
                    setValue('variant', '');
                    setSelectedVariantId(null);
                    break;
                  case 'variant':
                    setSelectedVariantId(newValue);
                    break;
                  default:
                    break;
                }
              }}
              value={getValues(fieldName) || ''}
              isDisabled={
                fieldName === 'brand' ? !subCategoryId || (subCategoryId === 18 && !selectedTypeId) :
                fieldName === 'model' ? (!selectedBrandId && subCategoryId !== 13) :
                fieldName === 'variant' ? !selectedModelId :
                false
              }
            >
              <option value="">Select {config.label}</option>
              {config.options?.map(option => (
                <option 
                  key={option.id || option} 
                  value={option.id || option}
                >
                  {option.name || option}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
          </FormControl>
        );
      case 'radio':
        return (
          <CommonWrapper>
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
          </CommonWrapper>
        );
      case 'checkbox':
        return (
          <FormControl key={fieldName}>
            <Checkbox {...register(fieldName)}>{config.label}</Checkbox>
          </FormControl>
        );
      case 'boostTag':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]}>
            <FormLabel fontSize={fontSize}>Boost Tag</FormLabel>
            <Select
              {...register(fieldName)}
              fontSize={fontSize}
              placeholder="Select boost tag"
              value={selectedBoostTag}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedBoostTag(value);
                setValue('adBoostTag', value);
              }}
            >
           
              {boostTags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    
    // Add required fixed fields
    formData.append('adShowroom', showroomId);
    formData.append('adCategory', categoryId);
    formData.append('adSubCategory', subCategoryId);
    formData.append('locationDistrict', districtId);
    formData.append('locationTown', townId);
    formData.append('adBoostTag', selectedBoostTag || '');

    // Get all possible fields from config
    const allConfigFields = Object.keys(adData || {}).reduce((acc, fieldName) => {
      const config = getFieldConfig(fieldName, [], [], brands, models, variants, types);
      if (config) {
        acc[fieldName] = true;
      }
      return acc;
    }, {});

    // Add all config fields to formData, with empty string if no value
    Object.keys(allConfigFields).forEach(fieldName => {
      const value = data[fieldName];
      formData.append(fieldName, value || '');
    });

    // Handle special fields that always need to be sent
    const specialFields = ['model', 'variant', 'brand', 'type'];
    specialFields.forEach(field => {
      if (!allConfigFields[field]) {
        formData.append(field, data[field] || '');
      }
    });

    // Handle images
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
    imageFiles.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    // Log the form data for debugging
    console.log('Form Data being sent to API:');
    for (let pair of formData.entries()) {
      if (pair[0] === 'images') {
        console.log(pair[0], 'File:', pair[1].name);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/${subCategoryDetails.apiUrl}/${ad.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        // Show success toast
        toast({
          title: 'Success',
          description: 'Ad updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        // Update the local cache with the updated ad data
        queryClient.setQueryData(["showroomAds", showroomId], (oldData) => {
          if (!oldData) return [];
          return oldData.map(ad => ad?.id === response.data.data.id ? response.data.data : ad);
        });

        // Convert uploaded images to File objects
        const imageFiles = await Promise.all(
          uploadedImages.map(async (image, index) => {
            if (image.file) {
              return image.file;
            } else if (image.isExisting) {
              try {
                const response = await fetch(image.preview);
                const blob = await response.blob();
                return new File([blob], `image_${index}.jpg`, { type: 'image/jpeg' });
              } catch (error) {
                console.error('Error converting existing image to file:', error);
                return null;
              }
            }
            return null;
          })
        );

        // Filter out any null values and create the callback data
        const validImageFiles = imageFiles.filter(file => file !== null);
        
        // Add getFieldConfig fields to adData
        const fieldsConfig = Object.keys(adData).reduce((acc, fieldName) => {
          const config = getFieldConfig(fieldName, [], [], brands, models, variants, types);
          if (config) {
            acc[fieldName] = adData[fieldName]; // Include the field data
          }
          return acc;
        }, {});

        const callbackData = {
          adData: {
            ...response.data.data,
            ...fieldsConfig, // Include the fields from getFieldConfig
            adShowroom: showroomId,
            locationDistrict: districtId,
            locationTown: townId
          },
          subCategoryDetails: subCategoryDetails,
          images: validImageFiles // Add images array to callback data
        };

        console.log('Data being passed to parent via onShowSuccess:', callbackData);
        queryClient.invalidateQueries("showroomAds");

        queryClient.invalidateQueries("userAds");
        queryClient.invalidateQueries("pendingAds");
        queryClient.invalidateQueries("expiredAds");

        onClose();
        onShowSuccess(callbackData);
      }
    } catch (error) {
      // Show error toast with specific message if available
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update ad. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });

      console.error('Error updating ad:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessToast = () => {
    toast({
      title: 'Success',
      description: 'Ad updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShowSuccessModal = useCallback(async (data) => {
    // Convert image URLs to File objects
    const imagePromises = data.adData.images.map(async (image, index) => {
      try {
        const response = await fetch(`${BASE_URL}${image.url}`);
        const blob = await response.blob();
        return new File([blob], `image_${index}.jpg`, { type: 'image/jpeg' });
      } catch (error) {
        console.error('Error converting image to file:', error);
        return null;
      }
    });

    const imageFiles = await Promise.all(imagePromises);
    const validImageFiles = imageFiles.filter(file => file !== null);

    setUpdatedAd({
      ...data.adData,
      images: validImageFiles // Pass the images as File objects
    });
    setSubCategoryDetails(data.subCategoryDetails);
    setShowSuccessModal(true);
  }, []);

  // Add effect to handle type changes for subcategory 18
  useEffect(() => {
    if (subCategoryId === 18 && selectedTypeId) {
      // Reset brand-related fields when type changes
      setValue('brand', '');
      setValue('model', '');
      setValue('variant', '');
      setSelectedBrandId(null);
      setSelectedModelId(null);
      setSelectedVariantId(null);
    }
  }, [subCategoryId, selectedTypeId, setValue]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}    closeOnOverlayClick={false} >
        <ModalOverlay />
        <ModalContent 
          className="bg-gray-100"
          position="relative"
        >
          <Icon
            as={IoClose}
            position="absolute"
            top="4"
            right="4"
            w={6}
            h={6}
            cursor="pointer"
            onClick={onClose}
            zIndex="1"
          />
          <ModalBody>
            {isDataLoaded ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} align="stretch">
                  {adData && Object.keys(adData).map((fieldName, index) => (
                    <React.Fragment key={fieldName + index}>
                      {renderField(fieldName)}
                    </React.Fragment>
                  ))}

                  <FormControl isInvalid={errors.adBoostTag}>
                    <FormLabel fontSize={fontSize}>Boost Tag</FormLabel>
                    <Select
                      {...register('adBoostTag')}
                      fontSize={fontSize}
                      placeholder="Select boost tag"
                      value={selectedBoostTag}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedBoostTag(value);
                        setValue('adBoostTag', value);
                      }}
                    >
                      {boostTags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.adBoostTag?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize={fontSize}>Images (Max 4)</FormLabel>
                    <Flex gap={3} flexWrap="wrap" justifyContent="center">
                      {uploadedImages.map((image, index) => (
                        <Box key={index} position="relative">
                          <Box className="relative w-[150px] h-[150px] bg-[#4F7598] rounded-md">
                            <Image src={image.preview} alt={`Image ${index + 1}`} className="object-cover w-full h-full rounded-md" />
                            <IoClose
                              className="absolute top-1 right-1 bg-[#4F7598] text-white rounded-full h-5 w-5 cursor-pointer"
                              onClick={() => removeImage(index)}
                            />
                          </Box>
                          <Text className="text-xs text-center mt-1">{image.isExisting ? 'Existing' : 'New'}</Text>
                        </Box>
                      ))}
                      
                      {uploadedImages.length < 4 && (
                        <Box>
                          <Box
                            className="w-[150px] h-[150px] bg-[#4F7598] rounded-md flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => document.getElementById('imageUpload').click()}
                          >
                            <IoAddOutline className="w-5 h-5 text-white" />
                            <Text className="text-xs text-center mt-1 text-white">
                              {uploadedImages.length === 0 ? 'Add image' : 'Upload more'}
                            </Text>
                          </Box>
                          <Text className="text-xs text-center mt-1">
                            {4 - uploadedImages.length} remaining
                          </Text>
                        </Box>
                      )}
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Flex>
                    <Text className="text-xs text-gray-500 mt-2">
                      Tip: You can upload up to 4 images in total. Click on the 'x' icon to remove an image.
                    </Text>
                  </FormControl>
                </VStack>

                <div>
                  <Button
                    className='w-full mt-4'
                    colorScheme='blue'
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Updating..."
                  >
                    Update Ad
                  </Button>
                </div>
              </form>
            ) : (
              <Center py={8}>
                <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='xl'
                />
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      
     
    </>
  );
};

export default EditShowroomad;
