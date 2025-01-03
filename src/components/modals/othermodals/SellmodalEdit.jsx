import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Portal,
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
import CongratulationsModal from './SellSuccessmodal.jsx'; // Update import path to match SellModal
import { useTypes } from '../../common/config/Api/UseTypes.jsx';
import { FaChevronDown } from 'react-icons/fa';

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
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [submittedAdType, setSubmittedAdType] = useState('');
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [submittedApiUrl, setSubmittedApiUrl] = useState(null);
  const [isTagCreationPossible, setIsTagCreationPossible] = useState('');
  const [submittedImages, setSubmittedImages] = useState([]);
  const [submittedAdId, setSubmittedAdId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [townSearchQuery, setTownSearchQuery] = useState('');

  const queryClient = useQueryClient();

  const { register, handleSubmit, control, formState: { errors }, setValue, getValues, reset, watch } = useForm();
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
  const { data: types, isLoading: isTypesLoading } = useTypes(isOpen, getUserToken, selectedSubCategoryId);
  const { data: brands, isLoading: isBrandsLoading } = useBrands(
    isOpen, 
    getUserToken, 
    selectedSubCategoryId,
    selectedSubCategoryId === 18 ? selectedTypeId : null
  );
  const { data: models, isLoading: isModelsLoading } = useModels(
    isOpen, 
    getUserToken, 
    selectedBrandId, 
    selectedSubCategoryId,
    selectedSubCategoryId === 18 ? selectedTypeId : null
  );
  const { data: variants, isLoading: isVariantsLoading } = useVariants(isOpen, getUserToken, selectedModelId, selectedSubCategoryId);
console.log(isTagCreationPossible);

  const fetchCompleteAdData = async (userToken, adCategoryId, adId) => {
    if (!userToken || !adCategoryId || !adId) return null;
    const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`, {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    console.log(data.data);
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
        setIsTagCreationPossible(data.isTagCreationPossible);
        queryClient.invalidateQueries("userAds");
        queryClient.invalidateQueries("expiredAds");
        queryClient.invalidateQueries("pendingAds");
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
      const districtId = completeAdData.locationDistrict?.id;
      setSelectedDistrictId(districtId);
      setValue('locationDistrict', districtId);
      const townId = completeAdData.locationTown?.id;
      if (townId) {
        setValue('locationTown', townId);
      }

      setInitialCategoryId(completeAdData.adCategory?.id);
      setSelectedCategoryId(completeAdData.adCategory?.id);
      setSelectedSubCategoryId(completeAdData.adSubCategory?.id);
      setSelectedBrandId(completeAdData.brand?.id);
      setSelectedModelId(completeAdData.model?.id);
      setSelectedVariantId(completeAdData.variant?.id);
      setSelectedTypeId(completeAdData.type?.id);

      Object.entries(completeAdData).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          setValue(key, value);
        }
      });

      setValue('adCategory', completeAdData.adCategory?.id);
      setValue('adSubCategory', completeAdData.adSubCategory?.id);
      setValue('locationDistrict', completeAdData.locationDistrict?.id);
      setValue('locationTown', completeAdData.locationTown?.id);
      setValue('brand', completeAdData.brand?.id);
      setValue('model', completeAdData.model?.id);
      setValue('variant', completeAdData.variant?.id);
      setValue('type', completeAdData.type?.id);

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
    setValue('type', '');
    setValue('brand', '');
    setValue('model', '');
    setValue('variant', '');
    setSelectedTypeId(null);
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSelectedVariantId(null);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // Get all selected files
    if (uploadedImages.length + files.length <= 10) { // Check total count
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isExisting: false
        }));
        setUploadedImages(prevImages => [...prevImages, ...newImages]); // Append new images
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
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

 

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
        let isAdCreationPossible = true;
        if (parseInt(data.adCategory) !== parseInt(initialCategoryId)) {
            isAdCreationPossible = true;
        } else {
            isAdCreationPossible = true;
        }
        

        if (!isAdCreationPossible) {
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

        const formData = new FormData();
        const alwaysIncludeFields = ['brand', 'model', 'variant', 'type'];

        Object.keys(data).forEach(key => {
            if (alwaysIncludeFields.includes(key)) {
                formData.append(key, data[key] || '');
            } else if (data[key] !== "") {
                formData.append(key, data[key]);
            }
        });

        formData.append('adShowroom', '');
        formData.append('adBoostTag', completeAdData?.adBoostTag?.id || '');
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
            setSubmittedAdId(response.data.data.id);
            setSubmittedAdType(subCategoryDetails.name);
            setSubmittedFormData({
                ...data,
                adShowroom: []
            });
            setSubmittedApiUrl(subCategoryDetails.apiUrl);
            setSubmittedImages(imageFiles);
            
            setShowCongratulations(true);
            onClose();

            queryClient.invalidateQueries("userAds");
            queryClient.invalidateQueries("pendingAds");
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

  const handleDistrictChange = (e) => {
    const newDistrictId = e.target.value;
    setSelectedDistrictId(newDistrictId);
    setValue('locationDistrict', newDistrictId);
    setValue('locationTown', '');
  };

  const renderField = (fieldName) => {
    const config = getFieldConfig(fieldName, districts, towns, brands, models, variants, types, selectedSubCategoryId);
    
    if (!config) return null;
    
    switch(config.type) {
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
                  <Flex 
                    flexWrap="wrap" 
                    gap={2}
                    sx={{
                      '& > *': {
                        flexBasis: {
                          base: config.options.length <= 3 ? '100%' : '48%', 
                          md: config.options.length <= 4 ? 'auto' : '30%', 
                          lg: config.options.length <= 6 ? 'auto' : '30%' 
                        }
                      }
                    }}
                  >
                    {config.options.map(option => (
                      <Radio 
                        key={option} 
                        value={option} 
                        className='border-black'
                        flex="1 1 auto"
                      >
                        {option}
                      </Radio>
                    ))}
                  </Flex>
                </RadioGroup>
              )}
            />
            <FormErrorMessage>{errors[fieldName] && errors[fieldName].message}</FormErrorMessage>
          </FormControl>
        );
      case 'select':
        // Special handling for town selection
        if (fieldName === 'locationTown') {
          const filteredTowns = config.options.filter(option => 
            option.name?.toLowerCase().includes(townSearchQuery.toLowerCase())
          );

          return (
            <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize} className='z-50'>
              <FormLabel>{config.label}</FormLabel>
              <Controller
                name={fieldName}
                control={control}
                rules={config.rules}
                render={({ field }) => (
                  <Menu matchWidth>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaChevronDown className='h-3 w-3 text-black' />}
                      w="100%"
                      textAlign="left"
                      isDisabled={isTownsLoading || !selectedDistrictId}
                      className='border-black border-[1px] px-3'
                      fontWeight="normal"
                    >
                      {isTownsLoading ? 'Loading towns...' : 
                        field.value ? 
                          config.options.find(opt => opt.id === field.value)?.name || 'Select Town' 
                          : 'Select Town'
                      }
                    </MenuButton>
                    <MenuList maxH="200px" overflowY="auto" zIndex={9999}>
                      <Box p={2}>
                        <Input
                          placeholder="Search town..."
                          value={townSearchQuery}
                          onChange={(e) => setTownSearchQuery(e.target.value)}
                          mb={2}
                          isDisabled={isTownsLoading}
                        />
                      </Box>
                      {isTownsLoading ? (
                        <MenuItem isDisabled fontWeight="normal">Loading towns...</MenuItem>
                      ) : (
                        <>
                          {filteredTowns.map(option => (
                            <MenuItem
                              key={option.id}
                              value={option.id}
                              onClick={() => {
                                field.onChange(option.id);
                                setTownSearchQuery('');
                              }}
                              fontWeight="normal"
                            >
                              {option.name}
                            </MenuItem>
                          ))}
                          {filteredTowns.length === 0 && (
                            <MenuItem isDisabled fontWeight="normal">No towns found</MenuItem>
                          )}
                        </>
                      )}
                    </MenuList>
                  </Menu>
                )}
              />
              <FormErrorMessage>
                {errors[fieldName] && errors[fieldName].message}
              </FormErrorMessage>
            </FormControl>
          );
        }

        // Default select handling for other fields
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Controller
              name={fieldName}
              control={control}
              rules={config.rules}
              render={({ field }) => (
                <Select
                  className='border-black'
                  {...field}
                  isDisabled={
                    fieldName === 'locationDistrict' ? isDistrictsLoading : 
                    fieldName === 'locationTown' ? isTownsLoading || !selectedDistrictId :
                    fieldName === 'brand' ? isBrandsLoading :
                    fieldName === 'model' ? isModelsLoading || (!watchBrand && selectedSubCategoryId !== '13') :
                    fieldName === 'variant' ? isVariantsLoading || !watchModel :
                    false
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    if (fieldName === 'locationDistrict') {
                      setSelectedDistrictId(e.target.value);
                      setValue('locationTown', '');
                    } else if (fieldName === 'type') {
                      setSelectedTypeId(e.target.value);
                      if (selectedSubCategoryId === '18') {
                        setValue('brand', '');
                        setValue('model', '');
                      }
                    } else if (fieldName === 'brand') {
                      setSelectedBrandId(e.target.value);
                      setValue('model', '');
                    } else if (fieldName === 'model') {
                      setSelectedModelId(e.target.value);
                    }
                  }}
                >
                  <option value="">Select {config.label}</option>
                  {config.options.map(option => (
                    <option key={option.id || option} value={option.id || option}>
                      {option.name || option}
                    </option>
                  ))}
                </Select>
              )}
            />
            <FormErrorMessage>
              {errors[fieldName] && errors[fieldName].message}
            </FormErrorMessage>
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



  const clearForm = () => {
    reset(); // Reset form values
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedDistrictId(null);
    setUploadedImages([]);
    setSubCategoryDetails(null);
    setCompleteAdData(null);
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setSelectedVariantId(null);
    setSelectedTypeId(null);
    setTownSearchQuery('');
  };

  // Add this useEffect to clear town search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTownSearchQuery('');
    }
  }, [isOpen]);

  const watchBrand = watch('brand');
  const watchModel = watch('model');

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={modalSize} 
        closeOnOverlayClick={false}
        zIndex={1400}
      >
        <ModalOverlay />
        <ModalContent 
          bg="#F1F1F1" 
          color="black" 
          maxWidth={{ base: "80%", md: modalSize }}
          position="relative"
          my={{ base: "auto", md: "3.75rem" }}
        >
          <Icon
            as={IoClose}
            position="absolute"
            top="4"
            right="4"
            w={6}
            h={6}
            cursor="pointer"
            onClick={() => {
              clearForm();
              onClose();
            }}
            zIndex="1"
          />
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
                
                {subCategoryDetails && (
                  <FormControl fontSize={fontSize} isInvalid={uploadedImages.length === 0}>
                    <FormLabel>Images (Max 10)</FormLabel>
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
                      {uploadedImages.length < 10 && (
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
                        multiple // Allow multiple file selection
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </Flex>
                    {uploadedImages.length === 0 && (
                      <FormErrorMessage>At least one image is required</FormErrorMessage>
                    )}
                  </FormControl>
                )}
                
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
        </ModalContent>
      </Modal>

      {showCongratulations && (
        <Portal>
          <CongratulationsModal 
            adType={submittedAdType}
            formData={submittedFormData}
            apiUrl={submittedApiUrl}
            isTagCreationPossible={isTagCreationPossible}
            images={submittedImages}
            adId={submittedAdId}
            onClose={() => setShowCongratulations(false)}
            zIndex={1500}
          />
        </Portal>
      )}
    </>
  );
}
  export default SellModalEdit