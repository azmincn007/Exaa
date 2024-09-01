import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box, Button, Center } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';
import CardUser from '../../../components/common/Cards/CardUser.jsx';

const fetchRecommendedAds = async () => {
  const endpoint = `${BASE_URL}/api/find-latest-recommended-ads-web`;
  const token = localStorage.getItem('UserToken');
  const selectedTownId = localStorage.getItem('selectedTownId');

  const params = {
    adLimit: 20, // Increased to fetch more ads initially
    ...(token ? {} : { locationTownId: selectedTownId }),
  };

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.get(endpoint, { params, headers });
  console.log(response.data.data);
  
  return response.data.data;
};

function RecommendedAdsGrid() {
  const { data, isLoading, error } = useQuery('recommendedAds', fetchRecommendedAds);
  const [visibleAds, setVisibleAds] = useState(8);

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Box>An error occurred: {error.message}</Box>;

  const showMoreAds = () => {
    setVisibleAds(prevVisible => Math.min(prevVisible + 4, data.length));
  };

  return (
    <Box>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
        {data?.slice(0, visibleAds).map((ad) => (
          <CardUser
            key={ad.id}
            isFeatured={ad.isFeatured}
            imageUrl={ad.images.url}
            price={ad.price}
            title={ad.title}
            location={ad.locationTown.name}
            postedDate={ad.postedDate}
            adBoostTag={ad.adBoostTag}
          />
        ))}
      </SimpleGrid>
      {visibleAds < data?.length && (
        <Center mt={4}>
          <Button onClick={showMoreAds} colorScheme="black" variant='outline' className='border-2'>
            Load More
          </Button>
        </Center>
      )}
    </Box>
  );
}

export default RecommendedAdsGrid;