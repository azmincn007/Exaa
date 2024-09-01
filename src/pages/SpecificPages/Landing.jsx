import React from 'react';
import { Box, Image, Skeleton, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import Downlaoddiv from '../../components/Specific/Landing/Downlaoddiv';
import RecommendedAdsGrid from '../../components/Specific/Landing/RecomendedAdsGrid';

const fetchBanners = async () => {
  const response = await axios.get(`${BASE_URL}/api/home-page`);
  console.log(response);
  
  return response.data.data.banners;
};

const Carousel = () => {
  const { data: images, isLoading, isError } = useQuery('banners', fetchBanners);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(timer);
  }, [images]);

  if (isLoading) {
    return <Skeleton height="200px" width="100%" />;
  }

  if (isError) {
    return <Box>Error loading images</Box>;
  }

  return (
    <Box position="relative" width="100%" paddingTop="56.25%">
      {images && images.map((banner, index) => (
        <Image
          key={index}
          src={`${BASE_URL}${banner.url}`}
          alt={`Slide ${index + 1}`}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="200px"
          objectFit="cover"
          opacity={index === currentIndex ? 1 : 0}
          transition="opacity 0.5s ease-in-out"
        />
      ))}
      <Text
        position="absolute"
        top="0"
        left="0"
        bg="rgba(0,0,0,0.5)"
        color="white"
        px="2"
        py="1"
        fontSize="sm"
        zIndex="1"
      >
        Advertisement
      </Text>
    </Box>
  );
};

function Landing() {
  return (
    <Box className='bg-offwhite py-8 font-Inter'>
      <Box className='w-full md:w-[60%] lg:w-[30%] mx-auto h-[200px]'>
        <Carousel />
      </Box>
      
      <Box className='w-[90%] md:w-[80%] mx-auto py-4'>
        <Box className='font-semibold text-2xl mb-4'>Latest Recommendations</Box>
        <RecommendedAdsGrid />
      </Box>
      
      <Downlaoddiv/>
    </Box>
  );
}

export default Landing;