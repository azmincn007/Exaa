import React from 'react';
import { Box, Avatar, Icon } from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';

const EditableAvatar = ({ onClick, ...props }) => {
  return (
    <Box position="relative" width="65px" height="65px" onClick={onClick} cursor="pointer">
      <Avatar bg="gray.500" width="100%" height="100%" {...props} />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="40%"
        background="linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)"
        borderBottomLeftRadius="full"
        borderBottomRightRadius="full"
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        paddingBottom="2px"
        overflow="hidden"
      >
        <Box
          width="100%"
          height="100%"
          position="absolute"
          backdropFilter="blur(2px)"
        />
        <Icon as={FaCamera} color="white" fontSize="sm" zIndex={1} />
      </Box>
    </Box>
  );
};

export default EditableAvatar;