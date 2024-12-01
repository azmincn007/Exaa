
import React, { useContext, useEffect } from 'react';
import { Box, Image, Skeleton, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import Downlaoddiv from '../../components/Specific/Landing/Downlaoddiv';
import RecommendedAdsGrid from '../../components/Specific/Landing/RecomendedAdsGrid';
import { TownContext } from '../../App'; // Make sure this path is correct
import SearchedAdsGrid from '../../components/Specific/Landing/SearchedAdsGrid';
import { useSearch } from '../../Hooks/SearchContext';

const fetchBanners = async () => {
  const response = await axios.get(`${BASE_URL}/api/home-page`);
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
        top="1"
        left="50%"
        transform="translateX(-50%)"
        bg="white"
        color="black"
        px="3"
        py="1"
        fontSize="sm"
        fontWeight="medium"
        borderRadius="2xl"
        zIndex="1"
      >
        Advertisement
      </Text>
    </Box>
  );
};

function Landing() {
  const [selectedTown] = useContext(TownContext);
  const { hasSearched,setHasSearched } = useSearch(); // Correctly destructured

  useEffect(() => {
    // Reset hasSearched when the component mounts
    setHasSearched(false);
  }, []);

  return (
    <Box className='bg-offwhite py-8 font-Inter'>
      <Box className='w-[60%] mx-auto h-[200px]'>
        <Carousel />
      </Box>
      {selectedTown && (
        <Box className='w-[90%] md:w-[80%] mx-auto py-4 sm:py-16'>
          <Box className='font-semibold text-2xl mb-4'>
            {hasSearched ? 'Search Results' : 'Latest Recommendations'}
          </Box>
          {hasSearched ? (
            <SearchedAdsGrid />
          ) : (
            <RecommendedAdsGrid />
          )}
        </Box>
      )}
    </Box>
  );
}

export default Landing;