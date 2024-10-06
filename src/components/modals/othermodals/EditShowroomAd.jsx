import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, NumberInput, NumberInputField, Checkbox, RadioGroup, 
  Radio, Stack, useToast, VStack, FormErrorMessage, Box, Flex, 
  Image, Icon, Text, useBreakpointValue, Select
} from '@chakra-ui/react';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import { useForm, Controller } from 'react-hook-form';
import getFieldConfig from '../../common/config/GetField';
import { IoAddOutline, IoClose } from 'react-icons/io5';

const EditShowroomad = ({ isOpen, onClose, ad, onSuccess, categoryId, subCategoryId, districtId, townId, showroomId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adData, setAdData] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState(null);
  const toast = useToast();
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm();
  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });
  const token = localStorage.getItem('UserToken');

  useEffect(() => {
    const fetchData = async () => {
      if (!ad?.id || !token || !subCategoryId) return;

      try {
        const [subCategoryResponse, adResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${subCategoryId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/find-one-ad/${categoryId}/${ad.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (subCategoryResponse.data.success) {
          setSubCategoryDetails(subCategoryResponse.data.data);
        }

        if (adResponse.data.success) {
          const filteredData = { ...adResponse.data.data };
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
      }
    };

    fetchData();
  }, [ad, categoryId, subCategoryId, token, setValue]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && uploadedImages.length < 4) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, { file, preview: reader.result, isExisting: false }]);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: 'Maximum images reached',
        description: 'You can only upload up to 4 images',
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
    const config = getFieldConfig(fieldName);
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
        return (
          <CommonWrapper>
            <Input {...register(fieldName, config.rules)} fontSize={fontSize} />
          </CommonWrapper>
        );
      case 'number':
        return (
          <CommonWrapper>
            <NumberInput>
              <NumberInputField {...register(fieldName, config.rules)} fontSize={fontSize} />
            </NumberInput>
          </CommonWrapper>
        );
      case 'select':
        return (
          <CommonWrapper>
            <Select {...register(fieldName, config.rules)} fontSize={fontSize}>
              <option value="">Select {config.label}</option>
              {config.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </CommonWrapper>
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
      default:
        return null;
    }
  };

 
  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Handle adShowroom
    const adShowroomValue = showroomId ? [showroomId] : [];
    formData.append('adShowroom', JSON.stringify(adShowroomValue));
  
    // Handle adCategory, adSubCategory, locationDistrict, and locationTown
    formData.append('adCategory', categoryId);
    formData.append('adSubCategory', subCategoryId);
    formData.append('locationDistrict', districtId);
    formData.append('locationTown', townId);
  
    // Append other form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'adShowroom') {
        formData.append(key, value);
      }
    });
  
    // Handle image uploads
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
  
    console.log('Data being sent to API:', Object.fromEntries(formData.entries()));
  
    try {
      setIsLoading(true);
      const token = localStorage.getItem('UserToken');
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
        onSuccess();
        onClose();
        toast({
          title: 'Success',
          description: 'Ad updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent className="bg-gray-100">
        <ModalHeader>Edit Showroom Ad</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              {adData && Object.keys(adData).map(fieldName => renderField(fieldName))}
              
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
            className='w-full mt-4 '
            colorScheme='blue'
                type="submit"
                isLoading={isLoading}
                loadingText="Updating..."
              >
                Update Ad
              </Button>
            </div>
            
            <Flex justify="flex-end" mt={6} gap={3}>
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditShowroomad;