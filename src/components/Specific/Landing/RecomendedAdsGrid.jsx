import React, { useState, memo, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box, Button, Center, useBreakpointValue, Skeleton, SkeletonText } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { BASE_URL } from '../../../config/config';
import CardUser from '../../../components/common/Cards/CardUser.jsx';
import { TownContext } from '../../../App';
import 'swiper/css';
import 'swiper/css/pagination';

const MemoizedCardUser = memo(CardUser);

function RecommendedAdsGrid() {
  const [selectedTown] = useContext(TownContext);
  const [visibleAds, setVisibleAds] = useState(8);
  
  const isSmallMobile = useBreakpointValue({ base: true, sm: false });
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3, xl: 4 });
  const skeletonCount = useBreakpointValue({ base: 4, sm: 4, md: 4, lg: 6, xl: 8 });

  const fetchRecommendedAds = async () => {
    const endpoint = `${BASE_URL}/api/find-latest-recommended-ads`;
    const params = {
      adLimit: 30,
      locationTownId: selectedTown,
    };
    const response = await axios.get(endpoint, { params });
    console.log(response.data.data);
    return response.data.data;
  };

  const { data, error, refetch, isLoading } = useQuery(['recommendedAds', selectedTown], fetchRecommendedAds, {
    enabled: !!selectedTown,
  });

  useEffect(() => {
    if (selectedTown) {
      refetch();
    }
  }, [selectedTown, refetch]);

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
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Skeleton height="200px" />
      <Box p="6">
        <SkeletonText mt="1" noOfLines={1} spacing="4" />
        <SkeletonText mt="2" noOfLines={2} spacing="4" />
        <Skeleton mt="4" height="20px" width="50%" />
      </Box>
    </Box>
  );

  const renderSkeletons = () => (
    <>
      {renderSkeleton()}
      {columns >= 2 && renderSkeleton()}
      {columns >= 3 && renderSkeleton()}
      {columns >= 4 && renderSkeleton()}
      {skeletonCount > 4 && (
        <>
          {renderSkeleton()}
          {columns >= 2 && renderSkeleton()}
          {columns >= 3 && renderSkeleton()}
          {columns >= 4 && renderSkeleton()}
        </>
      )}
    </>
  );

  if (error) {
    return <Box>An error occurred: {error.message}</Box>;
  }

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
          {isLoading ? (
            <>
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
            </>
          ) : (
            data.map(renderCard)
          )}
        </Swiper>
      ) : (
        <>
          <SimpleGrid columns={columns} spacing={4}>
            {isLoading ? renderSkeletons() : data.slice(0, visibleAds).map(renderCard)}
          </SimpleGrid>
          {!isLoading && visibleAds < dataLength && (
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