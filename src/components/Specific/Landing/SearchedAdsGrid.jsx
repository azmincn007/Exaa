import React, { useState, memo, useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SimpleGrid, Box, Button, Center, useBreakpointValue, Skeleton, SkeletonText } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BASE_URL } from '../../../config/config';
import CardUser from '../../../components/common/Cards/CardUser.jsx';
import { DistrictContext, TownContext } from '../../../App';
import { useSearch } from '../../../Hooks/SearchContext';
import 'swiper/css';

const MemoizedCardUser = memo(CardUser);

function SearchedAdsGrid() {
  const [selectedTown] = useContext(TownContext);
  const [selectedDistrict] = useContext(DistrictContext);
  const { searchText } = useSearch();
  console.log(searchText);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 16;
  const [visibleAds, setVisibleAds] = useState(8);
  const isSmallMobile = useBreakpointValue({ base: true, sm: false });
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3, xl: 4 });
  const skeletonCount = useBreakpointValue({ base: 4, sm: 4, md: 4, lg: 6, xl: 8 });

  const fetchSearchedAds = async () => {
    const endpoint = `${BASE_URL}/api/find-home-page-search-ads`;
    const params = {
      adLimit: 30,
      locationTownId: selectedTown === "all" ? '"all"' : String(selectedTown),
      locationDistrictId: selectedDistrict === "all" ? '"all"' : String(selectedDistrict),
      search: searchText,
      sort:''
    };
    
    const config = {};
    const token = localStorage.getItem('UserToken');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await axios.get(endpoint, { params, ...config });
    return response.data.data;
  };

  const { data, error, refetch, isLoading } = useQuery(['searchedAds', selectedTown, searchText], fetchSearchedAds, {
    enabled: !!selectedTown && !!searchText,
  });

  useEffect(() => {
    if (selectedTown && searchText) {
      refetch();
    }
  }, [selectedTown, searchText, refetch]);

  const dataLength = data ? data.length : 0;

  const renderPaginatedCards = (data) => {
    if (!data) return null;
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return data.slice(startIndex, endIndex).map(renderCard);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / CARDS_PER_PAGE);
    const maxVisiblePages = 5;
    
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
          pagination={false}
          modules={[]}
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
            renderPaginatedCards(data)
          )}
        </Swiper>
      ) : (
        <>
          <SimpleGrid columns={columns} spacing={4}>
            {isLoading ? renderSkeletons() : renderPaginatedCards(data)}
          </SimpleGrid>
          {renderPagination(dataLength)}
        </>
      )}
    </Box>
  );
}

export default SearchedAdsGrid;