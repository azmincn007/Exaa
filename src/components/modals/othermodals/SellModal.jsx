import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
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
import { BASE_URL } from '../../../config/config';
import { IoAddOutline, IoClose } from 'react-icons/io5';
import SellInput from '../../../components/forms/Input/SellInput.jsx';
import CongratulationsModal from './SellSuccessmodal.jsx';
import getFieldConfig from '../../common/config/GetField.jsx';
import {useCategories, useSubCategories, useDistricts, useTowns, fetchSubCategoryDetails } from '../../common/config/SellModalQueries.jsx';
import { useBrands } from '../../common/config/Api/UseBrands.jsx';
import { useModels } from '../../common/config/Api/UseModels.jsx';
import { useVariants } from '../../common/config/Api/UseVarient.jsx';
import { useTypes } from '../../common/config/Api/UseTypes.jsx';
import { useNavigate } from 'react-router-dom';

const SellModal = ({ isOpen, onClose, onSuccessfulSubmit }) => {
  const [isUpdatingFields, setIsUpdatingFields] = useState(false);

  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [submittedAdType, setSubmittedAdType] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [submittedApiUrl, setSubmittedApiUrl] = useState(null);
  const [isTagCreationPossible, setIsTagCreationPossible] = useState(false);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [submittedAdId, setSubmittedAdId] = useState(null);
  const { register, handleSubmit, control, formState: { errors }, setValue, reset, getValues,watch } = useForm();
  const getUserToken = useCallback(() => localStorage.getItem('UserToken'), []);
  const toast = useToast();
  const navigate=useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });

  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useCategories(isOpen, getUserToken);
  const { data: subCategories, isLoading: isSubCategoriesLoading, isError: isSubCategoriesError, error: subCategoriesError } = useSubCategories(isOpen, getUserToken, selectedCategoryId);
  const { data: districts, isLoading: isDistrictsLoading, isError: isDistrictsError } = useDistricts(isOpen, getUserToken);
  const { data: towns, isLoading: isTownsLoading, isError: isTownsError } = useTowns(isOpen, getUserToken, selectedDistrictId);
  const {
    data: brands,
    isLoading: isBrandsLoading,
    isError: isBrandsError,
  } = useBrands(
    isOpen,
    getUserToken,
    selectedSubCategoryId,
    selectedSubCategoryId === '18' ? selectedTypeId : null
  );
  const { data: models, isLoading: isModelsLoading, error } = useModels(isOpen, getUserToken, selectedBrandId, selectedSubCategoryId, selectedSubCategoryId === '18' ? selectedTypeId : null);
  const { data: variants, isLoading: isVariantsLoading, isError: isVariantsError } = useVariants(isOpen, getUserToken, selectedModelId, selectedSubCategoryId);
  const { data: types, isLoading: isTypesLoading, isError: isTypesError } = useTypes(isOpen, getUserToken, selectedSubCategoryId);

  // Add this new useEffect hook
  useEffect(() => {
    if (!isOpen) {
      // Reset all relevant state when the modal is closed
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setSelectedDistrictId(null);
      setUploadedImages([]);
      setSubCategoryDetails(null);
      reset(); // This will reset all form fields
    }
  }, [isOpen, reset]);

  const clearForm = useCallback(() => {
    reset();
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedDistrictId(null);
    setUploadedImages([]);
    setSubCategoryDetails(null);
    // Reset other relevant state variables here
  }, [reset]);

  const handleCategoryChange = useCallback((e) => {
    const newCategoryId = e.target.value;
    setSelectedCategoryId(newCategoryId);
    setSelectedSubCategoryId(null);
    setSubCategoryDetails(null);
    setValue('adCategory', newCategoryId);
    setValue('adSubCategory', '');
  }, [setValue]);

  const handleSubCategoryChange = useCallback((e) => {
    const newSubCategoryId = e.target.value;
    setSelectedSubCategoryId(newSubCategoryId);
    setValue('adSubCategory', newSubCategoryId);
    if (newSubCategoryId) {
      fetchSubCategoryDetails(getUserToken(), newSubCategoryId)
        .then(data => {
          setSubCategoryDetails(data);
        })
        .catch(error => {
          console.error('Error fetching subcategory details:', error);
          toast({
            title: "Error fetching subcategory details",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      setSubCategoryDetails(null);
    }
  }, [setValue, getUserToken, toast]);

  useEffect(() => {
    if (selectedSubCategoryId) {
      const currentValues = getValues();
      const fieldsToReset = Object.keys(currentValues).reduce((acc, key) => {
        if (key !== 'adCategory' && key !== 'adSubCategory') {
          acc[key] = '';
        } else {
          acc[key] = currentValues[key];
        }
        return acc;
      }, {});
      reset(fieldsToReset);
    }
  }, [selectedSubCategoryId, getValues, reset]);
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
      console.log(response.data.data);
  
      return {
        isAdCreationPossible: response.data.data.isAdCreationPossible,
        isTagCreationPossible: response.data.data.isTagCreationPossible
      };
    } catch (error) {
      console.error('Error checking ad creation possibility:', error);
      toast({
        title: "Error checking category permission",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return { isAdCreationPossible: false, isTagCreationPossible: false };
    }
  };
  const onSubmit = async (data) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      // First check if ad creation is possible
      const { isAdCreationPossible, isTagCreationPossible } = await checkAdCreationPossibility(data.adCategory);
      console.log(isAdCreationPossible);
      
      if (!isAdCreationPossible) {
        onClose();
        navigate('/packages/post-more-ads');
        toast({
          title: "Package Required",
          description: "You need to purchase a package to post more ads in this category. Redirecting you to available packages.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      // Get the required fields from subcategory details
      const relevantFields = subCategoryDetails?.requiredFields || [];
      
      // Define fields that should always be included even if empty
      const alwaysIncludeFields = ['brand', 'model', 'variant', 'type'];
      
      // Filter and process the form data
      const filteredData = Object.keys(data).reduce((obj, key) => {
        // Include if it's a relevant field AND has a value
        if (relevantFields.includes(key) && data[key] !== "") {
          obj[key] = data[key];
        }
        // Include if it's a required base field
        else if (['adCategory', 'adSubCategory', 'locationDistrict', 'locationTown'].includes(key) && data[key] !== "") {
          obj[key] = data[key];
        }
        // Include if it's in alwaysIncludeFields list, even if empty
        else if (alwaysIncludeFields.includes(key)) {
          obj[key] = data[key] || ''; // Use empty string if value is null/undefined
        }
        return obj;
      }, {});

      // Add required empty arrays/fields
      filteredData.adShowroom = [];
      filteredData.adBoostTag = '';
  
      // Create FormData and append all fields
      const formData = new FormData();
      Object.keys(filteredData).forEach(key => {
        if (key === 'adShowroom') {
          formData.append(key, JSON.stringify(filteredData[key]));
        } else {
          formData.append(key, filteredData[key]);
        }
      });
  
      // Handle image uploads
      const imageFiles = uploadedImages.map(image => image.file);
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
  
      // Make API request
      const apiUrl = `${BASE_URL}/api/${subCategoryDetails.apiUrl}`;
      const token = getUserToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await axios.post(apiUrl, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200 || response.status === 201) {
        // Capture the adID from the response
        const adId = response.data.data.id; // Adjust this based on your API response structure
        setSubmittedAdId(adId);

        setSubmittedAdType(subCategoryDetails.name);
        setSubmittedFormData(filteredData);
        setSubmittedApiUrl(subCategoryDetails.apiUrl);
        setSubmittedImages(uploadedImages.map(img => img.file)); // Pass the actual file objects
        setShowCongratulations(true);
        clearForm();
        onClose();
        
        queryClient.invalidateQueries("userAds");
        
        if (onSuccessfulSubmit) {
          onSuccessfulSubmit();
        }
  
        setIsTagCreationPossible(isTagCreationPossible);
      } else {
        throw new Error('Failed to add ad');
      }
    } catch (error) {
      let errorMessage = 'Error adding ad';
  
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      toast({
        title: errorMessage,
        description: error.response?.data?.description || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && uploadedImages.length < 4) {
      setUploadedImages(prevImages => [...prevImages, { file, preview: URL.createObjectURL(file) }]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index);
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(prevImages[index].preview);
      return newImages;
    });
  };

    // Watch the brand field
    const watchBrand = watch('brand');
    const watchModel = watch('model');

    useEffect(() => {
      if (watchBrand && !isUpdatingFields) {
        setIsUpdatingFields(true);
        setSelectedBrandId(watchBrand);
        setValue('model', '');
        setValue('variant', '');
        setSelectedModelId(null);
        setIsUpdatingFields(false);
      }
    }, [watchBrand, setValue]);
  
    // Handle model change
    useEffect(() => {
      if (watchModel && !isUpdatingFields) {
        setIsUpdatingFields(true);
        setSelectedModelId(watchModel);
        setValue('variant', '');
        setIsUpdatingFields(false);
      }
    }, [watchModel, setValue]);
  
    const renderField = (fieldName) => {
      const config = getFieldConfig(fieldName, districts, towns, brands, models, variants, types, selectedSubCategoryId);
      
      if (!config) return null;
      
      switch(config.type) {
        case 'select':
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
                        // Reset dependent fields when type changes
                        if (selectedSubCategoryId === '18') {
                          setValue('brand', '');
                          setValue('model', '');
                          setValue('variant', '');
                          setSelectedBrandId(null);
                          setSelectedModelId(null);
                        }
                      } else if (fieldName === 'brand') {
                        setSelectedBrandId(e.target.value);
                        setValue('model', '');
                        setValue('variant', '');
                        setSelectedModelId(null);
                      } else if (fieldName === 'model') {
                        setSelectedModelId(e.target.value);
                        setValue('variant', '');
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
            <FormErrorMessage>{errors[fieldName] && errors[fieldName].message}</FormErrorMessage>
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

  const ImageUploadBox = ({ onClick, children }) => (
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
      onClick={onClick}
    >
      {children}
    </Box>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {
        clearForm(); // Call clearForm when closing the modal
        onClose();
      }} size={modalSize}>
        <ModalOverlay />
        <ModalContent 
          bg="#F1F1F1" 
          color="black" 
          maxWidth={{ base: "80%", md: modalSize }}
        >
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 py-3'>
              <h3 className={`text-${headingSize} font-bold mb-3`}>Add your ad details</h3>
              
              <FormControl isInvalid={errors.adCategory} fontSize={fontSize}>
                <FormLabel>Category</FormLabel>
                <Select 
                  placeholder='Select Category'
                  isDisabled={isCategoriesLoading}
                  {...register('adCategory', { required: 'Category is required' })}
                  onChange={handleCategoryChange}
                >
                  {categories?.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </Select>
                <FormErrorMessage>{errors.adCategory && errors.adCategory.message}</FormErrorMessage>
              </FormControl>
              {isCategoriesError && <div className="text-red-500 text-sm">Error: {categoriesError.message}</div>}

              <FormControl isInvalid={errors.adSubCategory} fontSize={fontSize}>
                <FormLabel>Sub-Category</FormLabel>
                <Select 
                  placeholder='Select Sub-Category'
                  isDisabled={!selectedCategoryId || isSubCategoriesLoading}
                  {...register('adSubCategory', { required: 'Sub-category is required' })}
                  onChange={handleSubCategoryChange}
                  value={selectedSubCategoryId || ''}
                >
                  {subCategories?.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </Select>
                <FormErrorMessage>{errors.adSubCategory && errors.adSubCategory.message}</FormErrorMessage>
              </FormControl>
              {isSubCategoriesError && <div className="text-red-500 text-sm">Error: {subCategoriesError.message}</div>}
              
              {subCategoryDetails && subCategoryDetails.requiredFields?.map(fieldName => renderField(fieldName))}
              
              {selectedSubCategoryId && (
                <FormControl fontSize={fontSize}>
                  <FormLabel>Upload Images (Max 4)</FormLabel>
                  <Flex gap={3} flexWrap="wrap" justifyContent="center">
                    {uploadedImages.map((image, index) => (
                      <Box key={index} position="relative">
                        <ImageUploadBox>
                          <Image src={image.preview} alt={`Uploaded ${index + 1}`} objectFit="cover" w="100%" h="100%" />
                          <IoClose 
                            className='absolute top-1 right-1 bg-[#4F7598] rounded-full h-[20px] w-[20px]' 
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
                   
                    {uploadedImages.length < 4 && (
                      <ImageUploadBox onClick={() => document.getElementById('imageUpload').click()}>
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
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </Flex>
                </FormControl>
              )}
              
              <Button 
                type="submit" 
                colorScheme="blue" 
                mt={3} 
                fontSize={fontSize}
                isLoading={isSubmitting}
                loadingText="Submitting..."
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose} fontSize={fontSize}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showCongratulations && (
  <CongratulationsModal 
    adType={submittedAdType}
    formData={submittedFormData}
    apiUrl={submittedApiUrl}
    isTagCreationPossible={isTagCreationPossible}
    images={submittedImages} // This now contains the actual File objects
    adId={submittedAdId}
    onClose={() => setShowCongratulations(false)}
  />
)}
      </>
    );
  };
  
  export default SellModal;
