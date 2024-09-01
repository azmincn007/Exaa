import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Divider
} from '@chakra-ui/react';
import { IMAGES } from '../../../constants/logoimg';
import { Link } from 'react-router-dom';
import LoginWithMobileOrEmail from './loginwithemailorphone';
import SignupModal from './SignupModal';

function LoginModal({ isOpen, onClose }) {
  const [isLoginWithMobileOrEmailOpen, setIsLoginWithMobileOrEmailOpen] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openLoginWithMobileOrEmail = (type) => {
    setLoginType(type);
    setIsLoginWithMobileOrEmailOpen(true);
  };

  const closeLoginWithMobileOrEmail = () => {
    setIsLoginWithMobileOrEmailOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    onClose(); // Close the LoginModal
  };

  const handleLoginSuccess = () => {
    closeLoginWithMobileOrEmail();
    onClose(); // Close the LoginModal
  };

  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent className="bg-white p-4 rounded-lg font-Inter min-h-[450px]">
          <ModalHeader className="flex items-center justify-center">
            <img className="h-[35px] w-auto" src={IMAGES.ExaLogoBlack} alt="Exa Logo" />
          </ModalHeader>
          <Divider className="border-gray-300" />
          <ModalBody className="pt-16 w-4/6 mx-auto flex justify-center items-center">
            <div className='flex justify-center flex-col items-center gap-2 w-full'>
              <Button
                className='w-[100%] font-semibold'
                colorScheme='black'
                variant='outline'
                borderWidth="2px"
                onClick={() => openLoginWithMobileOrEmail('phone')}
              >
                Continue With Phone
              </Button>
              <p className='flex justify-center'>or</p>
              <Button
                className="w-[100%] font-semibold"
                colorScheme='black'
                variant='outline'
                borderWidth="2px"
                onClick={() => openLoginWithMobileOrEmail('email')}
              >
                Continue With Email
              </Button>
              <p className='text-[#828282] text-12 pt-4'>if you are a new user</p>
              <Link className='text-exaBluetxt font-semibold' onClick={openSignUpModal}>Sign Up</Link>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end font-300 text-12 w-4/5 mx-auto text-center opacity-60">
            <div>
              All your personal details are safe with us. <br />
              By clicking continue, you agree to our <span className='text-exaBluetxt opa'>Terms of Service and Privacy Policy</span>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <LoginWithMobileOrEmail 
        isOpen={isLoginWithMobileOrEmailOpen}
        onClose={closeLoginWithMobileOrEmail}
        loginType={loginType}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignupModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
    </>
  );
}

export default LoginModal;