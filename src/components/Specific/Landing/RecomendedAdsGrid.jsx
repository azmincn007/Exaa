import React, { useState, memo, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box, Button, Center, useBreakpointValue, Skeleton, Card, CardBody } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { BASE_URL } from '../../../config/config';
import CardUser from '../../../components/common/Cards/CardUser.jsx';
import { TownContext } from '../../../App'; // Make sure this path is correct
import 'swiper/css';
import 'swiper/css/pagination';

const MemoizedCardUser = memo(CardUser);

function RecommendedAdsGrid() {
  const [selectedTown] = useContext(TownContext);
  const [visibleAds, setVisibleAds] = useState(8);
  
  const isSmallMobile = useBreakpointValue({ base: true, sm: false });
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3, xl: 4 });

  const fetchRecommendedAds = async () => {
    const endpoint = `${BASE_URL}/api/find-latest-recommended-ads`;
    const token = localStorage.getItem('UserToken');

    

    const params = {
      adLimit: 30,
      locationTownId: selectedTown,
    };

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(endpoint, { params, headers });
    console.log(response.data.data);
    
    return response.data.data;
  };

  const { data, isLoading, error, refetch } = useQuery(['recommendedAds', selectedTown], fetchRecommendedAds, {
    enabled: !!selectedTown,
  });

  useEffect(() => {
    if (selectedTown) {
      refetch();
    }
  }, [selectedTown, refetch]);

  if (error) return <Box>An error occurred: {error.message}</Box>;

  const dataLength = data ? data.length : 0;

  const showMoreAds = () => {
    setVisibleAds((prevVisible) => Math.min(prevVisible + 4, dataLength));
  };

  const renderCard = (ad) => (
    <SwiperSlide key={ad.id}>
      <MemoizedCardUser
        id={ad.id}
        adCategoryId={ad.adCategory.id}
        isFeatured={ad.isFeatured}
        imageUrl={ad.images?.url || ''}
        price={ad.price}
        title={ad.title}
        location={ad.locationTown.name}
        postedDate={ad.postedDate}
        adBoostTag={ad.adBoostTag}
        isAdFavourite={ad.isAdFavourite}
      />
    </SwiperSlide>
  );

  const renderSkeleton = () => (
    <SwiperSlide>
      <Card maxW='300px' className='overflow-hidden shadow-md relative cardUser'>
        <CardBody className='p-2'>
          <div className='relative'>
            <Skeleton height='170px' width='100%' />
          </div>
          <div className='p-3 font-Roboto'>
            <Skeleton height='24px' width='80px' />
            <Skeleton height='16px' width='100%' mt={2} />
            <Skeleton height='16px' width='100%' mt={2} />
            <div className='mt-2 flex justify-between text-xs text-gray-500'>
              <Skeleton height='16px' width='60px' />
              <Skeleton height='16px' width='60px' />
            </div>
          </div>
        </CardBody>
      </Card>
    </SwiperSlide>
  );

  return (
    <Box>
      {isSmallMobile ? (
        <Swiper
          slidesPerView={1.2}
          spaceBetween={10}
          centeredSlides={true}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {isLoading ? Array.from({ length: 8 }).map(renderSkeleton) : data.map(renderCard)}
        </Swiper>
      ) : (
        <>
          <SimpleGrid columns={columns} spacing={4}>
            {isLoading ? Array.from({ length: visibleAds }).map((_, index) => (
              <SwiperSlide key={index}>
                <Card maxW='300px' className='overflow-hidden shadow-md relative cardUser'>
                  <CardBody className='p-2'>
                    <div className='relative'>
                      <Skeleton height='200px' width='100%' />
                    </div>
                    <div className='p-3 font-Roboto'>
                      <Skeleton height='24px' width='80px' />
                      <Skeleton height='16px' width='100%' mt={2} />
                      <Skeleton height='16px' width='100%' mt={2} />
                      <div className='mt-2 flex justify-between text-xs text-gray-500'>
                        <Skeleton height='16px' width='60px' />
                        <Skeleton height='16px' width='60px' />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </SwiperSlide>
            )) : data.slice(0, visibleAds).map(renderCard)}
          </SimpleGrid>
          {visibleAds < dataLength && (
            <Center mt={4}>
              <Button onClick={showMoreAds} colorScheme="black" variant="outline" className="border-2">
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