import React, { useState, memo, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box, Button, Center, useBreakpointValue, Skeleton, SkeletonText } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BASE_URL } from '../../../config/config';
import CardUser from '../../../components/common/Cards/CardUser.jsx';
import { DistrictContext, TownContext } from '../../../App';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const MemoizedCardUser = memo(CardUser);

function RecommendedAdsGrid() {
  const [selectedTown] = useContext(TownContext);
  const [selectedDistrict, setSelectedDistrict] = useContext(DistrictContext);
  
  

  
  
  const [visibleAds, setVisibleAds] = useState(16);
  const isSmallMobile = useBreakpointValue({ base: true, sm: false });
  const columns = useBreakpointValue({ base: 2, sm: 2, md: 2, lg: 3, xl: 4 });
  const skeletonCount = useBreakpointValue({ base: 8, sm: 12, md: 12, lg: 12, xl: 16 });
  const CARDS_PER_PAGE = useBreakpointValue({ base: 8, sm: 12, md: 12, lg: 12, xl: 16 });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecommendedAds = async () => {
    const endpoint = `${BASE_URL}/api/find-latest-recommended-ads`;
    const params = {
      adLimit: 30,
      locationTownId: selectedTown === "all" ? '"all"' : String(selectedTown),
      locationDistrictId: selectedDistrict === "all" ? '"all"' : String(selectedDistrict)
    };
    
    const config = {};
    const token = localStorage.getItem('UserToken');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await axios.get(endpoint, { params, ...config });
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
    setVisibleAds((prevVisible) => Math.min(prevVisible + 16, dataLength));
  };

  const renderCard = (ad) => (
    <SwiperSlide key={ad.id}>
      <MemoizedCardUser
        id={ad.id}
        adCategoryId={ad.adCategory.id}
        adSubCategoryId={ad.adSubCategory.id}
        isFeatured={ad.isFeatured}
        imageUrl={ad.images?.url || ''}
        price={ad.price}
        title={ad.title}
        location={ad.locationTown.name}
        postedDate={ad.postedDate}
        adBoostTag={ad.adBoostTag?.name}
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

  const renderPaginatedCards = (data) => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return data.slice(startIndex, endIndex).map(renderCard);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / CARDS_PER_PAGE);
    const maxVisiblePages = 5; // Show max 5 page numbers at once
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <Center mt={4} mb={4}>
        <Box display="flex" gap={2} alignItems="center">
          {startPage > 1 && (
            <>
              <Button
                size="sm"
                onClick={() => handlePageChange(1)}
                colorScheme={currentPage === 1 ? "blue" : "gray"}
              >
                1
              </Button>
              {startPage > 2 && <Box>...</Box>}
            </>
          )}
          
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              colorScheme={currentPage === pageNum ? "blue" : "gray"}
              size="sm"
            >
              {pageNum}
            </Button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <Box>...</Box>}
              <Button
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                colorScheme={currentPage === totalPages ? "blue" : "gray"}
              >
                {totalPages}
              </Button>
            </>
          )}
        </Box>
      </Center>
    );
  };

  if (error) {
    return <Box>An error occurred: {error.message}</Box>;
  }

  return (
    <Box>
      {isSmallMobile ? (
        <>
          <Swiper
            slidesPerView={2}
            slidesPerGroup={2}
            spaceBetween={10}
            centeredSlides={false}
            className="mySwiper"
            style={{ width: '100%', overflow: 'hidden' }}
          >
            {isLoading ? (
              <>
                {renderSkeleton()}
                {renderSkeleton()}
                {renderSkeleton()}
                {renderSkeleton()}
              </>
            ) : (
              renderPaginatedCards(data)
            )}
          </Swiper>
          {!isLoading && data && renderPagination(data.length)}
        </>
      ) : (
        <>
          <SimpleGrid columns={columns} spacing={4}>
            {isLoading ? renderSkeletons() : renderPaginatedCards(data)}
          </SimpleGrid>
          {!isLoading && data && renderPagination(data.length)}
        </>
      )}
    </Box>
  );
}

export default RecommendedAdsGrid;