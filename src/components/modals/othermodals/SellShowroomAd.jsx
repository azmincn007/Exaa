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
  Tooltip,
} from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';
import { IoAddOutline, IoClose } from 'react-icons/io5';
import SellInput from '../../../components/forms/Input/SellInput.jsx';
import CongratulationsModal from './SellSuccessmodal.jsx';
import getFieldConfig from '../../common/config/GetField.jsx';
import { fetchSubCategoryDetails } from '../../common/config/SellModalQueries.jsx';
import { useBrands } from '../../common/config/Api/UseBrands.jsx';
import { useModels } from '../../common/config/Api/UseModels.jsx';
import { useVariants } from '../../common/config/Api/UseVarient.jsx';
import { useTypes } from '../../common/config/Api/UseTypes.jsx';
import { useNavigate } from 'react-router-dom';
import { InfoIcon } from 'lucide-react';
import { ImCoinDollar } from 'react-icons/im';
import { FaCircleInfo } from 'react-icons/fa6';

const SellShowroomAd = ({ isOpen, onClose, categoryId, showroomCategoryId, subCategoryId, AdCreate, districtId, townId, showroomid, onAdCreated, onEditSuccess }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const { register, handleSubmit, control, formState: { errors }, setValue, reset, getValues, watch, setError } = useForm();
  const getUserToken = useCallback(() => localStorage.getItem('UserToken'), []);
  const toast = useToast();
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [submittedApiUrl, setSubmittedApiUrl] = useState(null);
  const [isTagCreationPossible, setIsTagCreationPossible] = useState(false);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [submittedAdId, setSubmittedAdId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boostTags, setBoostTags] = useState([]);
  const [selectedBoostTag, setSelectedBoostTag] = useState(null);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });
  console.log(AdCreate);

  const { data: brands } = useBrands(
    isOpen, 
    getUserToken, 
    selectedSubCategoryId,
    selectedSubCategoryId === 18 ? selectedTypeId : null
  );
  const { data: models } = useModels(
    isOpen, 
    getUserToken, 
    selectedBrandId, 
    selectedSubCategoryId,
    selectedSubCategoryId === 18 ? selectedTypeId : null
  );
  const { data: variants } = useVariants(isOpen, getUserToken, selectedModelId, selectedSubCategoryId);
  const { data: types } = useTypes(isOpen, getUserToken, selectedSubCategoryId);

  useEffect(() => {
    if (selectedSubCategoryId) {
      fetchSubCategoryDetails(getUserToken(), selectedSubCategoryId)
        .then(data => {
          setSubCategoryDetails(data);
          reset();
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
      reset();
    }
  }, [selectedSubCategoryId, getUserToken, toast, reset]);

  useEffect(() => {
    const fetchBoostTags = async () => {
      const token = getUserToken();
      if (!token) return;

      try {
        const response = await axios.get(`${BASE_URL}/api/ad-boost-tags`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setBoostTags(response.data.data);
      } catch (error) {
        console.error('Error fetching boost tags:', error);
        toast({
          title: "Error fetching boost tags",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (isOpen) {
      fetchBoostTags();
    }
  }, [isOpen, getUserToken, toast]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedSubCategoryId  && isOpen) {
        try {
          const token = getUserToken();
          const response = await axios.get(
            `${BASE_URL}/api/ad-find-showroom-category-sub-categories-without-all-of-the-above/${showroomCategoryId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          
          setAvailableSubCategories(response.data.data);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
          toast({
            title: "Error fetching subcategories",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchSubCategories();
  }, [showroomCategoryId, selectedSubCategoryId, isOpen, getUserToken, toast]);

  useEffect(() => {
    setSelectedSubCategoryId(subCategoryId || null);
  }, [subCategoryId]);

  const handleSubcategorySelect = (selectedId) => {
    setSelectedSubCategoryId(selectedId);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('subcategoryId', selectedId);
    navigate(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setError('images', {
        type: 'manual',
        message: 'At least one image is required'
      });
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Remove the checkAdCreationPossibility function call and set both values to true
      const isAdCreationPossible = true;
      const isTagCreationPossible = true;

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

      const relevantFields = subCategoryDetails?.requiredFields || [];
      
      const filteredData = relevantFields.reduce((obj, key) => {
        if (key === 'variant' && data[key] === undefined) {
          obj[key] = "";
        } else {
          obj[key] = data[key] !== undefined ? data[key] : "";
        }
        return obj;
      }, {});
    
      filteredData.adShowroom = showroomid ? showroomid : '';
      filteredData.adCategory = categoryId;
      filteredData.adSubCategory = selectedSubCategoryId;
      filteredData.locationDistrict = districtId;
      filteredData.locationTown = townId;
      filteredData.adBoostTag = selectedBoostTag || '';



      const formData = new FormData();
      Object.keys(filteredData).forEach(key => {
        if (key === 'adShowroom') {
          formData.append(key, JSON.stringify(filteredData[key]));
        } else {
          formData.append(key, filteredData[key]);
        }
      });
    
      const imageFiles = uploadedImages.map(image => image.file);
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    
  
    
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
        const adId = response.data.data.id;
        setSubmittedAdId(adId);
        setSubmittedFormData(filteredData);
        setSubmittedApiUrl(subCategoryDetails.apiUrl);
        setSubmittedImages(imageFiles); // Pass the actual file objects
        setIsTagCreationPossible(isTagCreationPossible);
        setShowCongratulations(true);
        reset();
        setUploadedImages([]);
        onClose();
        queryClient.invalidateQueries("userAds");
        queryClient.invalidateQueries("pendingAds");
        queryClient.invalidateQueries("showroomAds");
        if (onAdCreated) {
          onAdCreated();
        }

        // Call onEditSuccess if it exists
        if (onEditSuccess) {
          onEditSuccess(response.data.data); // Pass the created ad data
        }

        // Add success toast
      
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
    
      if (error.response && error.response.status === 404) {
        navigate('/packages/post-more-ads');
      } else {
        toast({
          title: errorMessage,
          description: error.response?.data?.description || error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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

  const watchBrand = watch('brand');
  const watchModel = watch('model');

  useEffect(() => {
    if (watchBrand) {
      setSelectedBrandId(watchBrand);
      setValue('model', '');
      setValue('variant', '');
      setSelectedModelId(null);
    }
  }, [watchBrand, setValue]);

  useEffect(() => {
    if (watchModel) {
      setSelectedModelId(watchModel);
      setValue('variant', '');
    }
  }, [watchModel, setValue]);

  const renderField = (fieldName) => {
    // Skip rendering for locationDistrict and locationTown
    if (fieldName === 'locationDistrict' || fieldName === 'locationTown') {
      return null;
    }

    const config = getFieldConfig(
      fieldName, 
      [], 
      [], 
      brands, 
      models, 
      variants, 
      types, 
      selectedSubCategoryId  // Add this parameter
    );
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
                  {...field}
                  className='border-black'
                  isDisabled={
                    fieldName === 'brand' ? !selectedSubCategoryId || (selectedSubCategoryId === 18 && !selectedTypeId) :
                    fieldName === 'model' ? (!selectedBrandId && selectedSubCategoryId !== 13) :
                    fieldName === 'variant' ? !selectedModelId :
                    false
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    if (fieldName === 'type') {
                      setSelectedTypeId(e.target.value);
                      // Reset dependent fields when type changes for subcategory 18
                      if (selectedSubCategoryId === 18) {
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
            <FormErrorMessage>{errors[fieldName] && errors[fieldName].message}</FormErrorMessage>
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

  // Add useEffect to reset boost tag when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBoostTag(null);
      setValue('boostTags', ''); // Reset the form field
    }
  }, [isOpen, setValue]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {
        setSelectedBoostTag(null); // Reset state
        setValue('boostTags', ''); // Reset form field
        onClose(); // Call the original onClose
      }} size={modalSize} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent 
          bg="#F1F1F1" 
          color="black" 
          maxWidth={{ base: "80%", md: modalSize }}
          position="relative"
        >
          <Icon
            as={IoClose}
            position="absolute"
            top="2"
            right="2"
            w={6}
            h={6}
            cursor="pointer"
            onClick={onClose}
            zIndex="1"
          />
          <ModalBody>
            {!selectedSubCategoryId ? (
              <Box 
                py={8} 
                textAlign="center"
                maxWidth="600px"
                mx="auto"
              >
                <Icon 
                  as={IoAddOutline} 
                  w={12} 
                  h={12} 
                  color="#4F7598" 
                  mb={4}
                />
                <Text 
                  fontSize={headingSize} 
                  fontWeight="bold" 
                  mb={4} 
                  color="#4F7598"
                >
                  Select a Subcategory
                </Text>
                <Text 
                  fontSize={fontSize} 
                  color="gray.600" 
                  mb={6}
                >
                  Please select a subcategory for your showroom ad to continue
                </Text>
                <FormControl 
                  bg="white" 
                  p={5} 
                  borderRadius="xl" 
                  boxShadow="lg"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Select
                    placeholder="Choose a subcategory"
                    onChange={(e) => handleSubcategorySelect(e.target.value)}
                    size="lg"
                    borderColor="#4F7598"
                    _hover={{ borderColor: "#2D3748" }}
                    _focus={{ borderColor: "#2D3748", boxShadow: "0 0 0 1px #2D3748" }}
                  >
                    {availableSubCategories.map((subCat) => (
                      <option key={subCat.id} value={subCat.id}>
                        {subCat.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 py-3'>
                <h3 className={`text-${headingSize} font-bold mb-3`}>Add your showroom ad details</h3>
                
                {subCategoryDetails && subCategoryDetails.requiredFields?.map(fieldName => renderField(fieldName))}
                <FormControl isInvalid={errors?.boostTags}>
                  <div className='flex items-center'>
                    <FormLabel fontSize={fontSize} className='mb-0'>
                      Boost Tags
                    </FormLabel>
                    {!AdCreate && (
                      <Tooltip 
                        label="Boost tags are only available for users with subscription" 
                        fontSize="sm"
                        placement="top"
                      >
                        <Box display="inline-block">
                          <FaCircleInfo style={{ cursor: 'help' }} />
                        </Box>
                      </Tooltip>
                    )}
                  </div>
                  <Controller
                    name="boostTags"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        {...field} 
                        placeholder="Select a boost tag" 
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedBoostTag(e.target.value);
                        }}
                        isDisabled={!AdCreate}
                        opacity={!AdCreate ? 0.6 : 1}
                        cursor={!AdCreate ? 'not-allowed' : 'pointer'}
                      >
                        {boostTags.map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <FormErrorMessage>{errors?.boostTags && errors.boostTags.message}</FormErrorMessage>
                </FormControl>
                <FormControl fontSize={fontSize} isInvalid={errors.images} isRequired>
                  <FormLabel>Upload Images (Max 10) </FormLabel>
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
                    {uploadedImages.length < 10 && (
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
                      multiple // Allow multiple file selection
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </Flex>
                  {errors.images && (
                    <FormErrorMessage>{errors.images.message}</FormErrorMessage>
                  )}
                </FormControl>
                
                <Button type="submit" colorScheme="blue" mt={3} fontSize={fontSize}>Submit</Button>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SellShowroomAd;

