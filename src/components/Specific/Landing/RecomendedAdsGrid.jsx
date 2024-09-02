import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box, Button, Center, useBreakpointValue } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { BASE_URL } from '../../../config/config';
import CardUser from '../../../components/common/Cards/CardUser.jsx';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const fetchRecommendedAds = async () => {
  const endpoint = `${BASE_URL}/api/find-latest-recommended-ads-web`;
  const token = localStorage.getItem('UserToken');
  const selectedTownId = localStorage.getItem('selectedTownId');

  const params = {
    adLimit: 20,
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

  const isSmallMobile = useBreakpointValue({ base: true, sm: false });
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3, xl: 4 });

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Box>An error occurred: {error.message}</Box>;

  const showMoreAds = () => {
    setVisibleAds(prevVisible => Math.min(prevVisible + 4, data.length));
  };

  const renderCard = (ad) => (
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
  );

  return (
    <Box>
      {isSmallMobile ? (
        <Swiper
          slidesPerView={1.2}
          spaceBetween={10}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
        >
          {data?.map((ad) => (
            <SwiperSlide key={ad.id}>{renderCard(ad)}</SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <SimpleGrid columns={columns} spacing={4}>
            {data?.slice(0, visibleAds).map(renderCard)}
          </SimpleGrid>
          {visibleAds < data?.length && (
            <Center mt={4}>
              <Button onClick={showMoreAds} colorScheme="black" variant='outline' className='border-2'>
                Load More
              </Button>
            </Center>
          )}
        </>
      )}
    </Box>
  );
}

export default RecommendedAdsGrid;