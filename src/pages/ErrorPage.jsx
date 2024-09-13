import React from 'react';
import { Box, Button, Heading, Text, Image, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

// You can replace this URL with any illustration you like
const illustrationUrl = 'https://example.com/your-illustration.png'; // Replace with your illustration URL

const ErrorPage = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.100"
      padding={4}
    >
      <VStack spacing={6} textAlign="center">
        <Image
          src={illustrationUrl}
          alt="Error Illustration"
          boxSize="300px"
          objectFit="cover"
        />
        <Heading as="h1" size="2xl" color="red.600">
          Oops! Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.600">
          The page you are looking for does not exist or has been moved.
        </Text>
        <Link to="/">
          <Button colorScheme="blue" size="lg">
            Go Back Home
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default ErrorPage;