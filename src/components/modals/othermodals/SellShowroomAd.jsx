import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
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

const fetchSubCategoryDetails = async (userToken, subCategoryId) => {
  if (!userToken) throw new Error('No user token found');
  if (!subCategoryId) throw new Error('No subcategory selected');
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${subCategoryId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  console.log(data.data);
  return data.data;
};

const SellShowroomAd = ({ isOpen, onClose, categoryId, subCategoryId, districtId, townId, showroomid ,onAdCreated }) => {
console.log(showroomid);
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  
  const { register, handleSubmit, control, formState: { errors }, setValue, reset, getValues } = useForm();
  const getUserToken = useCallback(() => localStorage.getItem('UserToken'), []);
  const toast = useToast();

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });

  const { data: subCategoryData, isLoading: isSubCategoryLoading, isError: isSubCategoryError } = useQuery(
    ['subCategoryDetails', getUserToken, subCategoryId],
    () => fetchSubCategoryDetails(getUserToken(), subCategoryId),
    { 
      enabled: isOpen && !!getUserToken() && !!subCategoryId,
      onSuccess: (data) => {
        setSubCategoryDetails(data);
      }
    }
  );

  useEffect(() => {
    if (subCategoryId) {
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
  }, [subCategoryId, getValues, reset]);

  const clearForm = useCallback(() => {
    reset();
    setUploadedImages([]);
    setSubCategoryDetails(null);
  }, [reset]);

  const onSubmit = async (data) => {
    const relevantFields = subCategoryDetails?.requiredFields || [];
    const filteredData = Object.keys(data)
      .filter(key => relevantFields.includes(key) || ['adCategory', 'adSubCategory', 'locationDistrict', 'locationTown'].includes(key))
      .reduce((obj, key) => {
        if (data[key] !== "" && key !== 'adShowroom') {
          obj[key] = data[key];
        }
        return obj;
      }, {});
  
    filteredData.adShowroom = showroomid ? [showroomid] : [];
    filteredData.adCategory = categoryId;
    filteredData.adSubCategory = subCategoryId;
    filteredData.locationDistrict = districtId;
    filteredData.locationTown = townId;
  
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
  
    try {
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
        toast({
          title: "Ad added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        clearForm();
        onClose();
        onAdCreated();  // Call the callback function after successful submission
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
    }
    clearForm()
    onClose()
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && uploadedImages.length < 4) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prevImages => [...prevImages, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const getFieldConfig = (fieldName) => {
    const commonRules = { required: `${fieldName} is required` };
    const numberRules = { ...commonRules, min: { value: 0, message: `${fieldName} must be positive` } };
    
    switch(fieldName) {
      case 'title':
      case 'description':
      case 'brand':
      case 'model':
      case 'variant':
      case 'transmission':
      case 'rtoCode':
      case 'listedBy':
      case 'typeOfAccomodation':
      case 'facing':
      case 'projectName':
      case 'qualification':
        return { type: 'text', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: commonRules };
      case 'price':
      case 'year':
      case 'kmDriven':
      case 'noOfOwners':
      case 'bedrooms':
      case 'bathrooms':
      case 'totalFloors':
      case 'floorNo':
      case 'carParking':
      case 'type':
      case 'carpetArea':
      case 'maintenance':
      case 'securityAmount':
      case 'monthlyRent':
      case 'plotArea':
      case 'length':
      case 'breadth':
      case 'totalLandArea':
      case 'engineCC':
      case 'motorPower':
      case 'buyYear':
      case 'experience':
      case 'salary':
        return { type: 'number', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: numberRules };
      case 'superBuiltupArea':
        return { type: 'number', label: "Super Built Up Area", rules: numberRules };
      case 'isActiveAd':
      case 'isShowroomAd':
        return { type: 'checkbox', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: {} };
      case 'furnishing':
        return { type: 'select', label: "Furnishing", options: ["Furnished", "Semi-Furnished", "Unfurnished"], rules: commonRules };
      case 'constructionStatus':
        return { type: 'select', label: "Construction Status", options: ["Under Construction", "Ready to Move"], rules: commonRules };
      case 'salaryPeriod':
        return { type: 'select', label: "Salary Period", options: ["Monthly", "Annual"], rules: commonRules };
      case 'fuel':
        return { type: 'radio', label: "Fuel", options: ["Petrol", "Diesel"], rules: commonRules };
      case 'adShowroom':
        return null;
      default:
        return null;
    }
  };

  const renderField = (fieldName) => {
    const config = getFieldConfig(fieldName);
    
    if (!config) return null;
    
    switch(config.type) {
      case 'select':
        return (
          <FormControl key={fieldName} isInvalid={errors[fieldName]} fontSize={fontSize}>
            <FormLabel>{config.label}</FormLabel>
            <Select {...register(fieldName, config.rules)}>
              <option value="">Select {config.label}</option>
              {config.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
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
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent 
        bg="#F1F1F1" 
        color="black" 
        maxWidth={{ base: "80%", md: modalSize }}
      >
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 py-3'>
            <h3 className={`text-${headingSize} font-bold mb-3`}>Add your showroom ad details</h3>
            
            {isSubCategoryLoading && <Text>Loading subcategory details...</Text>}
            {isSubCategoryError && <Text color="red.500">Error loading subcategory details</Text>}
            
            {subCategoryDetails && subCategoryDetails.requiredFields?.map(fieldName => renderField(fieldName))}
            
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
            
            <Button type="submit" colorScheme="blue" mt={3} fontSize={fontSize}>Submit</Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose} fontSize={fontSize}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SellShowroomAd;