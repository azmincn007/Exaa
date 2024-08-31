import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';
import '../../../components/common/Cards/CardUser.jsx'
import CardUser from '../../../components/common/Cards/CardUser.jsx';

const fetchRecommendedAds = async () => {
  const endpoint = `${BASE_URL}/api/find-latest-recommended-ads-web`;
  const token = localStorage.getItem('UserToken');
  const selectedTownId = localStorage.getItem('selectedTownId');

  const params = {
    adLimit: 12,
    ...(token ? {} : { locationTownId: selectedTownId }),
  };

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.get(endpoint, { params, headers });
  console.log(response.data.data);
  
  return response.data.data;
};

function RecommendedAdsGrid() {
  const { data, isLoading, error } = useQuery('recommendedAds', fetchRecommendedAds);

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Box>An error occurred: {error.message}</Box>;

  return (
    <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
      {data?.map((ad) => (
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
  );
}

export default RecommendedAdsGrid;