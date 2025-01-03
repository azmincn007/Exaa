import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Button, Divider, Text, PinInput, PinInputField, HStack, useToast } from "@chakra-ui/react";
import { IMAGES } from "../../../constants/logoimg";
import { IoArrowBack } from "react-icons/io5";
import { BiSolidEdit } from "react-icons/bi";
import { useMutation } from 'react-query';
import axios from "axios";
import { BASE_URL } from "../../../config/config";
import { useAuth } from "../../../Hooks/AuthContext";

function OtpVerify({ isOpen, onClose, verificationType, contactInfo, onEdit, onLoginSuccess }) {
  const [otp, setOtp] = useState("");
  const toast = useToast();
  const { login } = useAuth(); 

  const verifyOtpMutation = useMutation(
    (otpData) => axios.post(`${BASE_URL}/api/auth/verifyOtp`, otpData),
    {
      onSuccess: (data) => {
        const jwtToken = data.data.data.jwt;
        if (jwtToken) {
          console.log("Login Response JWT:", jwtToken);
          login(jwtToken);  // Use the login function from AuthContext

          toast({
            title: "Login Successful",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // Call onLoginSuccess to close both modals
          if (typeof onLoginSuccess === 'function') {
            onLoginSuccess(data.data);
          } else {
            console.warn("onLoginSuccess is not defined");
            onClose(); // Fallback to just closing the OTP modal
          }
        } else {
          console.warn("JWT token not found in the response");
        }
      },
      onError: (error) => {
        console.error("API Error:", error);
        toast({
          title: "Verification Failed",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleVerify = () => {
    verifyOtpMutation.mutate({ otp, [verificationType]: contactInfo });
  };

  const handleResend = (method) => {
    console.log(`Resending code via ${method}`);
    // Implement resend logic here
  };

  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom"         size={{ base: 'xs', sm: 'sm', md: 'md' }}
>
      <ModalOverlay />
      <ModalContent className="bg-white p-4 rounded-lg font-Inter min-h-[500px]">
        <ModalHeader className="flex items-center justify-center">
          <img className="h-[35px] w-auto" src={IMAGES.ExaLogoBlack} alt="Exa Logo" />
        </ModalHeader>
        <Divider className="border-gray-300" />
        <ModalBody className=" ">
          <div className="absolute left-4 cursor-pointer" onClick={onClose}>
            <IoArrowBack className="h-[30px] w-[30px]" />
          </div>
          <div className="flex justify-center flex-col items-center gap-4 w-full mt-16">
            <p className="font-semibold authtxthead">Enter Verification Code</p>
            <Text className="text-center">
              <p className="font-[300] text-16">
                We've sent a 4 digit code to{' '}
                <span className="font-semibold text-black inline-flex items-center">
                  {verificationType === "phone" ? `+91 ${contactInfo}` : contactInfo}
                  <BiSolidEdit className="ml-1 cursor-pointer" onClick={onEdit} />
                </span>
              </p>
            </Text>
            <div className="w-4/6 mx-auto">
              <HStack className="flex justify-center">
                <PinInput otp onChange={handleOtpChange}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <Button
                className="w-full py-6"
                colorScheme="blue"
                isFullWidth
                mt={4}
                onClick={handleVerify}
                isDisabled={otp.length !== 4 || verifyOtpMutation.isLoading}
                isLoading={verifyOtpMutation.isLoading}
              >
                Verify
              </Button>
              {verificationType === "phone" ? (
                <div className="mt-4 text-center font-semibold">
                  <Text className="text-12  cursor-pointer " onClick={() => handleResend('sms')}>
                    Resend the code by SMS
                  </Text>
                  <Text className="text-12  cursor-pointer mt-2" onClick={() => handleResend('call')}>
                    Resend the code by call
                  </Text>
                </div>
              ) : (
                <Text className="mt-4 text-12  text-center cursor-pointer font-semibold" onClick={() => handleResend('email')}>
                  Resend the code
                </Text>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default OtpVerify;