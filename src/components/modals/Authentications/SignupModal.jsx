import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  Button, 
  Divider, 
  ModalFooter,
  useToast
} from "@chakra-ui/react";
import { IMAGES } from "../../../constants/logoimg";
import { IoArrowBack } from "react-icons/io5";

import EditableAvatar from "../../forms/EditableAvatar";
import CustomInput from '../../forms/Input/signup/CustomInput';
import MobileNumberInput from '../../forms/Input/signup/MobileNumberInput';
import AboutYouInput from '../../forms/Input/signup/AboutYouInput';
import { BASE_URL } from '../../../config/config';

function SignupModal({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const toast = useToast();

  const onSubmit = async (data) => {
    const apiData = {
      name: data.name,
      email: data.email,
      phone: `+91${data.phone}`,
      description: data.aboutYou
    };
    
    // Log the data being passed to the API
    console.log('Data being sent to API:', apiData);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/local/register`, apiData);
      
      console.log('Registration successful:', response.data);
      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAvatarClick = () => {
    console.log('Edit avatar clicked');
  };

  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent className="bg-white p-4 rounded-lg font-Inter min-h-[450px]">
        <ModalHeader className="flex items-center justify-center">
          <img className="h-[35px] w-auto" src={IMAGES.ExaLogoBlack} alt="Exa Logo" />
        </ModalHeader>
        <Divider className="border-gray-300" />
        <ModalBody className="w-full mx-auto mb-8">
          <div className="absolute left-4 cursor-pointer" onClick={onClose}>
            <IoArrowBack className="h-[30px] w-[30px]" />
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-[100%] flex flex-col items-center mt-12 gap-4">
            <EditableAvatar onClick={handleAvatarClick} />
            
            <CustomInput 
              label="Name" 
              name="name" 
              register={register} 
              rules={{ required: "Name is required" }} 
              error={errors.name}
            />
            <CustomInput 
              label="Email" 
              name="email" 
              type="email" 
              register={register} 
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }} 
              error={errors.email}
            />
              <MobileNumberInput 
              label="Mobile Number" 
              name="phone" 
              register={register} 
              rules={{ 
                required: "Mobile number is required",
                validate: (value) => value.length === 10 || "Mobile number must be 10 digits"
              }} 
              error={errors.phone}
            />
            <AboutYouInput 
              label="About You" 
              name="aboutYou" 
              register={register} 
              rules={{ maxLength: { value: 120, message: "Max length is 120 characters" } }} 
              error={errors.aboutYou}
            />
            
            <Button type="submit" className="w-full py-6 px-12" colorScheme="blue" isFullWidth mt={4}>
              Save And Continue
            </Button>
          </form>
        </ModalBody>
        <ModalFooter className="flex justify-end font-300 text-12 w-4/5 mx-auto text-center opacity-60">
          <div>
            All your personal details are safe with us. <br />
            By clicking continue, you agree to our <span className='text-exaBluetxt opa'>Terms of Service and Privacy Policy</span>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SignupModal;