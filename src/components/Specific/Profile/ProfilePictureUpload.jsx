import React from 'react';
import { Box, Text, Button, VStack, Grid, GridItem, Image, Center } from '@chakra-ui/react';
import { BiTrashAlt } from 'react-icons/bi';
import GoogleIcon from '../../../assets/googleicon.png'

const ProfilePictureUpload = () => {
  return (
    <Box borderWidth="2px" borderRadius="lg" p={6} width="100%" maxWidth="800px" borderColor='black'>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Profile Picture</Text>
      <Grid templateColumns="4fr 8fr" gap={6}>
        <GridItem>
          <Box 
            position="relative" 
            width="100%" 
            paddingBottom="100%" 
            bg="blue.100" 
            borderRadius="md"
          >
            <Center
              position="absolute"
              top="5%"
              left="5%"
              width="90%"
              height="90%"
              overflow="hidden"
              borderRadius="full"
            >
              <Image
                src="https://via.placeholder.com/300/87CEEB/FFFFFF"
                alt="Profile"
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </Center>
            <Button
              size="sm"
              position="absolute"
              top={2}
              right={2}
              colorScheme="gray"
              variant="solid"
              opacity={0.8}
            >
              <BiTrashAlt size={16} />
            </Button>
          </Box>
        </GridItem>
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" color="gray.600">Lorem ipsum dolor sit amet consectetur.</Text>
            <Text fontSize="sm" color="gray.600">Massa fames est sollicitudin amet massa dignissim in augue.</Text>
            <Text fontSize="sm" color="gray.600">Lorem ipsum dolor sit amet consectetur.</Text>
            <div className='w-[50%] gap-2 flex flex-col' >
  <Button colorScheme="blue" width="100%" variant="outline">
              Upload
            </Button>
            <Text textAlign="center" fontSize="sm" color="gray.500">or</Text>
            <Button 
              leftIcon={
                <Image 
                  src={GoogleIcon} 
                  alt="Google" 
                  width="18px" 
                  height="18px"
                />
              } 
              variant="outline" 
              width="100%"
              borderColor="gray.300"
            >
              Continue with Google
            </Button>
            </div>
          
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProfilePictureUpload;