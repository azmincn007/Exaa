import React from 'react';
import { Box, Input, Button, Grid, GridItem, Text, VStack } from '@chakra-ui/react';

const ProfileEditForm = () => {
  return (
    <Box maxWidth="800px" margin="auto" p={6} borderWidth={2} borderRadius="lg" boxShadow="md" borderColor="black">
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Basic Information</Text>
          <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
            <GridItem colSpan={{ base: 12, md: 5 }}>
              <Input 
                placeholder="Eliana Elissa" 
                border="1px" 
                borderColor="black" 
                _hover={{ borderColor: 'black' }} 
                _focus={{ borderColor: 'blue' }} 
              />
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 7 }}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Lorem ipsum dolor sit amet consectetur.</Text>
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Contact Information</Text>
          <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
            <GridItem colSpan={{ base: 12, md: 5 }}>
              <Input 
                placeholder="+91 | 0055575862" 
                mb={2} 
                border="1px" 
                borderColor="black" 
                _hover={{ borderColor: 'black' }} 
                _focus={{ borderColor: 'blue' }} 
              />
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 7 }}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Lorem ipsum dolor sit amet consectetur.</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 5 }}>
              <Input 
                placeholder="elianaelissa@gmail.com" 
                border="1px" 
                borderColor="black" 
                _hover={{ borderColor: 'black' }} 
                _focus={{ borderColor: 'blue' }} 
              />
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 7 }}>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Lorem ipsum dolor sit amet consectetur.</Text>
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Text fontWeight="semibold" fontSize={{ base: 'lg', md: 'xl' }} mb={2}>Additional Information</Text>
          <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
            <GridItem colSpan={{ base: 12, md: 5 }}>
              <Text fontWeight="bold">Google</Text>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
            </GridItem>
            <GridItem className='flex justify-end' colSpan={{ base: 12, md: 7 }}>
              <Button 
                variant="outline" 
                borderWidth={1} 
                borderColor="black" 
                size="md" 
                width="100%" // Changed to 100%
                _hover={{
                  bg: '#0071BC',
                  color: 'white',
                  borderColor: 'transparent',
                  transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                }}
                _active={{
                  bg: '#005B8C',
                  transform: 'scale(0.95)',
                }}
              >
                Link
              </Button>
            </GridItem>
          </Grid>
        </Box>
        <Grid templateColumns={{ base: 'repeat(12, 1fr)', md: 'repeat(12, 1fr)' }} gap={2}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Button 
              width='100%' // Changed to 100%
              variant="solid" 
              bg="#0071BC1A"
              color="#0071BC"
              size="md"
              _hover={{
                bg: '#005B8C',
                color: 'white',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              _active={{
                bg: '#003F5E',
                transform: 'scale(0.95)',
              }}
            >
              Discard
            </Button>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }} className='flex justify-end'>
            <Button 
              width='100%' // Changed to 100%
              colorScheme="blue" 
              size="md"
              _hover={{
                bg: '#005B8C',
                transition: 'background-color 0.3s ease',
              }}
              _active={{
                bg: '#003F5E',
                transform: 'scale(0.95)',
              }}
            >
              Save Changes
            </Button>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ProfileEditForm;