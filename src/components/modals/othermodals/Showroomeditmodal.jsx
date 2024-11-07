import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from 'react-query';
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Select,
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
  Textarea,
} from "@chakra-ui/react";
import { BASE_URL } from "../../../config/config";
import { IoAddOutline, IoClose } from "react-icons/io5";
import SellInput from "../../../components/forms/Input/SellInput.jsx";
import PhoneInputShowroom from "../../../components/forms/Input/MobileInputShowroom.jsx";

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

const ShowroomEditModal = ({ isOpen, onClose, showroom, onSuccess }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedShowroomSubCategoryId, setSelectedShowroomSubCategoryId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedTownId, setSelectedTownId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm();

  const [userToken, setUserToken] = useState(localStorage.getItem("UserToken"));
  const toast = useToast();
  const queryClient = useQueryClient();

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const imageBoxSize = useBreakpointValue({ base: "100px", md: "150px" });

  const categoriesQuery = useQuery(["adCategories", userToken], () => fetchCategories(userToken), {
    enabled: isOpen && !!userToken,
  });

  const subCategoriesQuery = useQuery(
    ["adSubCategories", userToken, selectedCategoryId],
    () => fetchSubCategories(userToken, selectedCategoryId),
    {
      enabled: isOpen && !!userToken && !!selectedCategoryId,
    }
  );

  const showroomCategoriesQuery = useQuery(
    ["showroomCategories", userToken, selectedSubCategoryId],
    () => fetchShowroomCategories(userToken, selectedSubCategoryId),
    {
      enabled: isOpen && !!userToken && !!selectedSubCategoryId,
    }
  );

  const districtsQuery = useQuery(["districts", userToken], () => fetchDistricts(userToken), {
    enabled: isOpen && !!userToken,
  });

  const townsQuery = useQuery(
    ["towns", userToken, selectedDistrictId],
    () => fetchTowns(userToken, selectedDistrictId),
    {
      enabled: isOpen && !!userToken && !!selectedDistrictId,
    }
  );

  useEffect(() => {
    if (isOpen && showroom) {
      const formData = {
        name: showroom.name,
        phone: showroom.phone.replace("+91", ""),
        whatsappNumber: showroom.whatsappNumber?.replace("+91", ""),
        address: showroom.address,
        description: showroom.description,
        websiteLink: showroom.websiteLink,
        facebookPageLink: showroom.facebookPageLink,
        adCategory: showroom.adCategory?.id,
        adShowroomCategory: showroom.adShowroomCategory?.id,
        adSubCategory: showroom.adSubCategory?.id,
        locationDistrict: showroom.locationDistrict?.id,
        locationTown: showroom.locationTown?.id,
      };

      reset(formData);
      
      setSelectedCategoryId(showroom.adCategory?.id);
      setSelectedSubCategoryId(showroom.adShowroomCategory?.id);
      setSelectedShowroomSubCategoryId(showroom.adSubCategory?.id);
      setSelectedDistrictId(showroom.locationDistrict?.id);
      setSelectedTownId(showroom.locationTown?.id);
      
      if (showroom.images) {
        setUploadedImage({ preview: `${BASE_URL}${showroom.images.url}` });
        fetch(`${BASE_URL}${showroom.images.url}`)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "existing_image.jpg", { type: "image/jpeg" });
            setImageFile(file);
          });
      }
    }
  }, [isOpen, showroom, reset]);

  const handleCategoryChange = useCallback(
    (e) => {
      const newCategoryId = e.target.value;
      setSelectedCategoryId(newCategoryId);
      setValue("adCategory", newCategoryId);
      setValue("adShowroomCategory", "");
      setValue("adSubCategory", "");
      setSelectedSubCategoryId(null);
      setSelectedShowroomSubCategoryId(null);
    },
    [setValue]
  );

  const handleSubCategoryChange = useCallback(
    (e) => {
      const newSubCategoryId = e.target.value;
      setSelectedSubCategoryId(newSubCategoryId);
      setValue("adShowroomCategory", newSubCategoryId);
      setValue("adSubCategory", "");
      setSelectedShowroomSubCategoryId(null);
    },
    [setValue]
  );

  const handleShowroomSubCategoryChange = useCallback(
    (e) => {
      const newSubCategoryId = e.target.value;
      setSelectedShowroomSubCategoryId(newSubCategoryId);
      setValue("adSubCategory", newSubCategoryId);
    },
    [setValue]
  );

  const handleDistrictChange = useCallback(
    (e) => {
      const newDistrictId = e.target.value;
      setSelectedDistrictId(newDistrictId);
      setValue("locationDistrict", newDistrictId);
      setValue("locationTown", "");
      setSelectedTownId(null);
    },
    [setValue]
  );

  const handleTownChange = useCallback(
    (e) => {
      const newTownId = e.target.value;
      setSelectedTownId(newTownId);
      setValue("locationTown", newTownId);
    },
    [setValue]
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({ preview: reader.result });
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "phone" || key === "whatsappNumber") {
        formData.append(key, `+91${data[key]}`);
      } else {
        formData.append(key, data[key]);
      }
    });

    if (imageFile) {
      formData.append("images", imageFile);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/ad-showrooms/${showroom.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        queryClient.invalidateQueries("showrooms");
        onSuccess();
        onClose();
 
      }
    } catch (error) {
      console.error("API Error:", error.response || error);
      toast({
        title: "Error updating showroom",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const ImageUploadBox = ({ onClick, children }) => (
    <Box
      w={imageBoxSize}
      h={imageBoxSize}
      backgroundColor="#4F7598"
      border="2px"
      borderColor="gray.300"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      color="white"
      onClick={onClick}
    >
      {children}
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent bg="#F1F1F1" color="black" maxWidth={{ base: "80%", md: modalSize }}>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 py-3">
            <h3 className={`text-${headingSize} font-bold mb-3`}>Edit Showroom</h3>

            <SellInput
              label="Name"
              type="text"
              name="name"
              register={register}
              rules={{ required: "Name is required" }}
              error={errors.name}
              fontSize={fontSize}
            />

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
              <FormErrorMessage>
                {errors.whatsappNumber && errors.whatsappNumber.message}
              </FormErrorMessage>
            </FormControl>

            <SellInput
              label="Address"
              type="text"
              name="address"
              register={register}
              rules={{ required: "Address is required" }}
              error={errors.address}
              fontSize={fontSize}
            />

            <FormControl isInvalid={errors.description}>
              <FormLabel fontSize={fontSize}>Description</FormLabel>
              <Textarea
                {...register("description", { required: "Description is required" })}
                placeholder="Enter showroom description"
                fontSize={fontSize}
              />
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
                  value: /^(https?:\/\/)?(www\.)?facebook.com\/.+/,
                  message: "Invalid Facebook page URL",
                },
              }}
              error={errors.facebookPageLink}
              fontSize={fontSize}
            />

            <FormControl isInvalid={errors.adCategory} fontSize={fontSize}>
              <FormLabel>Category</FormLabel>
              <Select
                className="border-black"
                placeholder="Select Category"
                isDisabled={true} // This disables the category selection
                {...register("adCategory", { required: "Category is required" })}
                value={selectedCategoryId || ""}
              >
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
                placeholder="Select Showroom Category"
                isDisabled={true} // This disables the showroom category selection
                {...register("adShowroomCategory", { required: "Showroom Category is required" })}
                value={selectedSubCategoryId || ""}
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
              <Select
                placeholder="Select Sub Category"
                isDisabled={true} // This disables the subcategory selection
                {...register("adSubCategory", { required: "Sub Category is required" })}
                value={selectedShowroomSubCategoryId || ""}
              >
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
                placeholder="Select District"
                isDisabled={districtsQuery.isLoading}
                {...register("locationDistrict", { required: "District is required" })}
                onChange={handleDistrictChange}
                value={selectedDistrictId || ""}
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
              <Select
                placeholder="Select Town"
                isDisabled={!selectedDistrictId || townsQuery.isLoading}
                {...register("locationTown", { required: "Town is required" })}
                onChange={handleTownChange}
                value={selectedTownId || ""}
              >
                {townsQuery.data?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.locationTown && errors.locationTown.message}</FormErrorMessage>
            </FormControl>
            <FormControl fontSize={fontSize}>
              <FormLabel>Upload Image</FormLabel>
              <Flex justifyContent="center">
                {uploadedImage ? (
                  <Box position="relative">
                    <ImageUploadBox>
                      <Image src={uploadedImage.preview} alt="Uploaded" objectFit="cover" w="100%" h="100%" />
                      <IoClose
                        className="absolute top-1 right-1 bg-[#4F7598] rounded-full h-[20px] w-[20px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      />
                    </ImageUploadBox>
                    <Text as="a" fontSize="xs" textAlign="center" mt={1}>
                      {imageFile ? imageFile.name : "Existing Image"}
                    </Text>
                  </Box>
                ) : (
                  <ImageUploadBox onClick={() => document.getElementById("imageUpload").click()}>
                    <Icon as={IoAddOutline} w={5} h={5} />
                    <Text fontSize="xs" textAlign="center" mt={1}>
                      Add image
                    </Text>
                  </ImageUploadBox>
                )}
                <input id="imageUpload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              </Flex>
            </FormControl>

            <Button type="submit" colorScheme="blue" mt={3} fontSize={fontSize}>
              Update Showroom
            </Button>
          </form>
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

export default ShowroomEditModal;
