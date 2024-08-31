import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Divider,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { IMAGES } from '../../../constants/logoimg';
import { IoArrowBack } from "react-icons/io5";
import MobileInput from '../../forms/Input/MobileInput';
import EmailInput from '../../forms/Input/EmailInput';
import OtpVerify from './OtpverifyModal';
import { BASE_URL } from '../../../config/config';

function LoginWithMobileOrEmail({ isOpen, onClose, loginType }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showFullText, setShowFullText] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const toast = useToast();

  const inputValue = watch(loginType === 'phone' ? 'phoneNumber' : 'email');
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isNextDisabled = loginType === 'phone' 
    ? inputValue?.length !== 10 
    : !inputValue || !isValidEmail(inputValue);

  const loginMutation = useMutation((data) => 
    axios.post(`${BASE_URL}/api/auth/local/web`, data),
    {
      onSuccess: (response) => {
        console.log('Login successful', response.data);
        setIsOtpModalOpen(true);
      },
      onError: (error) => {
        console.error('Login failed', error);
        toast({
          title: 'Login failed',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const onSubmit = (data) => {
    const payload = loginType === 'phone'
      ? { phone:`+91${data.phoneNumber}` }
      : { email: data.email };
    
    loginMutation.mutate(payload);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  const handleEdit = () => {
    setIsOtpModalOpen(false);
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen && !isOtpModalOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent className="bg-white p-4 rounded-lg font-Inter min-h-[450px]">
          <ModalHeader className="flex items-center justify-center">
            <img className="h-[35px] w-auto" src={IMAGES.ExaLogoBlack} alt="Exa Logo" />
          </ModalHeader>
          <Divider className="border-gray-300" />
          <ModalBody className="w-4/6 mx-auto ">
            <div className='absolute left-4 cursor-pointer' onClick={onClose}>
              <IoArrowBack className='h-[30px] w-[30px]'/>
            </div>
            <div className='flex justify-center flex-col items-center gap-4 w-full mt-16'>
              <p className='font-semibold authtxthead'>
                {loginType === 'phone' ? 'Enter Your Phone Number' : 'Enter Your Email'}
              </p>
              <Text
                className='text-gray-500 authtextnothead'
                noOfLines={showFullText ? undefined : 1}
                onClick={toggleShowFullText}
                cursor="pointer"
                width="100%"
              >
                {loginType === 'phone'
                   ? "We'll send you a verification code on the same number."
                  : "We'll send you a verification link on this email address."}
                {!showFullText && "..."}
              </Text>
              
              {loginType === 'phone' ? (
                <MobileInput
                  register={register}
                  errors={errors}
                />
              ) : (
                <EmailInput
                  register={register}
                  errors={errors}
                />
              )}
              
              <Button
                className='w-full py-6'
                colorScheme="blue"
                isFullWidth
                mt={4}
                isDisabled={isNextDisabled || loginMutation.isLoading}
                isLoading={loginMutation.isLoading}
                loadingText="Loading"
                onClick={handleSubmit(onSubmit)}
              >
              Next
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <OtpVerify
        isOpen={isOtpModalOpen}
        onClose={closeOtpModal}
        verificationType={loginType}
        contactInfo={inputValue}
        onEdit={handleEdit}
      />
    </>
  );
}

export default LoginWithMobileOrEmail;