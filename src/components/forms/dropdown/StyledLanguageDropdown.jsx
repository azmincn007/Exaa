import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const StyledLanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Language');
  const languages = ['English', 'Arabic', 'Hindi'];

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  return (
    <Box position="relative">
      <Box
        display="flex"
        alignItems="center"
        cursor="pointer"
        onClick={handleToggle}
        color="white"
        _hover={{ color: 'blue.300' }}
      >
        <Text mr={2}>{selectedLanguage}</Text>
        <ChevronIcon isOpen={isOpen} />
      </Box>
      <AnimatePresence>
        {isOpen && (
          <MotionBox
          zIndex="30"
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            borderRadius="md"
            overflow="hidden"
            boxShadow="lg"
          minWidth={200}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {languages.map((lang) => (
              <MotionBox
                key={lang}
                px={4}
                py={2}
                color="black"
                _hover={{ bg: 'blue.100' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(lang)}
              >
                {lang}
              </MotionBox>
            ))}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StyledLanguageDropdown;