import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Box, VStack, Text, Grid, GridItem, SimpleGrid, useBreakpointValue, Select, Button, Drawer, 
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, 
  IconButton, Skeleton, SkeletonCircle, SkeletonText
} from '@chakra-ui/react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { TownContext } from '../../../App';
import { Filter } from 'lucide-react'; 
import CategoryDropdown from '../Catgorybased/CategoryDropdown';
import DynamicFilters from '../Catgorybased/DynamicFilterss';
import CardUser from '../../common/Cards/CardUser';
import AdsService from '../../../Services/AdsServices';
import { useSearch } from '../../../Hooks/SearchContext';

const CategoryBasedGrid = () => {
  const { categoryId, categoryName } = useParams();
  const location = useLocation();
  const { subId } = location.state || {};
  const { hasSearched, searchText } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('relevance');
  const [visibleCount, setVisibleCount] = useState(16);
  const [selectedTown, selectedDistrict] = useContext(TownContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Initialize filters with a default state
  const [filters, setFilters] = useState({
    search: hasSearched ? searchText : '',
    fuel: [],
    yearStart: 2000,
    yearEnd: 2025,
    transmission: [],
    kmDriven: [],
    noOfOwners: [],
    bedrooms: [],
    bathrooms: [],
    furnishing: [],
    constructionStatus: [],
    listedBy: [],
    totalFloors: [],
    facing: [],
    totalLandAreaStart: 0,
    totalLandAreaEnd: 10000,
    superBuiltupAreaStart: 50,
    superBuiltupAreaEnd: 10000,
    carpetAreaStart: 50,
    carpetAreaEnd: 10000,
    engineCC: [],
    buyYearStart: 2010,
    buyYearEnd: 2025,
    salaryPeriod: [],
    positionType: [],
    qualification: [],
    experience: [],
    priceStart: 50,
    priceEnd: 3000000,
    floorNo:[],
    carParking:[],
    brand:[],
    types:[],
    model:[],
    monthlyRentStart:100,
    monthlyRentEnd:1000000,
    securityAmountStart:0,
    securityAmountEnd:500000,
    plotAreaStart:0,
    plotAreaEnd:50000,
    salaryStart:0,
    salaryEnd:100000,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Update search text in filters whenever it changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      search: hasSearched ? searchText : '',
    }));
  }, [hasSearched, searchText]);

  // Fetch subcategories
  const { data: subCategories, isLoading: isLoadingSubCategories } = useQuery(
    ['subCategories', categoryId],
    () => AdsService.fetchSubCategories(categoryId),
    { enabled: !!categoryId }
  );

  // Set initial selected category
  useEffect(() => {
    if (subCategories && subCategories.length > 0) {
      if (subId) {
        const initialCategory = subCategories.find(sub => sub.id === subId);
        setSelectedCategory(initialCategory || subCategories[0]);
      } else {
        setSelectedCategory(subCategories[0]);
      }
    }
  }, [subCategories, subId]);

  // Fetch ads data with comprehensive logging
  const { 
    data: adsData, 
    isLoading: isLoadingAdsData, 
    refetch: refetchAdsData 
  } = useQuery(
    ['adsData', selectedCategory?.id, selectedTown, selectedDistrict, filters, sortOption],
    () => {
      // Comprehensive logging of API call parameters
      console.log('Fetching Ads Data with Parameters:', {
        subCategoryId: selectedCategory?.id,
        selectedTownId: selectedTown || "all",
        selectedDistrictId: selectedDistrict || "all",
        filters: {
          ...filters,
          search: hasSearched ? searchText : ''
        },
        sortOption,
        hasSearched,
        searchText
      });

      return AdsService.fetchAdsData({
        subCategoryId: selectedCategory?.id,
        selectedTownId: selectedTown || "all",
        selectedDistrictId: selectedDistrict || "all",
        filters: {
          ...filters,
          search: hasSearched ? searchText : ''
        },
        sortOption
      });
    },
    { 
      enabled: !!selectedCategory?.id,
      onSuccess: (data) => {
        console.log('Fetched ads data:', data);
      },
      onError: (error) => {
        console.error('Error fetching adsData:', error);
      }
    }
  );

  // Handler for category selection
  const handleItemClick = (clickedItem) => {
    setSelectedCategory(clickedItem);
    setVisibleCount(16);
    setCurrentPage(1); // Reset to first page when category changes
    if (isOpen) onClose();
  };

  // Sort change handler
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sorting function
  const filteredAndSortedAdsData = useCallback(() => {
    if (!adsData || !adsData.data) {
      return [];
    }
    
    const sorted = [...adsData.data].sort((a, b) => {
      switch (sortOption) {
        case 'priceLowToHigh': return a.price - b.price;
        case 'priceHighToLow': return b.price - a.price;
        case 'postedDate': return new Date(b.postedDate) - new Date(a.postedDate);
        case 'relevance':
        default: return 0;
      }
    });
    
    return sorted;
  }, [adsData, sortOption]);

  // Filter change handler
  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    
    refetchAdsData(); // Refetch data when filters change
  };

  // Pagination functions
  const renderPaginatedAds = (ads) => {
    const startIndex = (currentPage - 1) * 16;
    const endIndex = startIndex + 16;
    return ads.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / 16);
    return (
      <Box display="flex" gap={2} justifyContent="center" mt={4}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            colorScheme={currentPage === i + 1 ? "blue" : "gray"}
            size="sm"
          >
            {i + 1}
          </Button>
        ))}
      </Box>
    );
  };

  // Responsive breakpoints
  const columns = useBreakpointValue({ base: "1fr", md: "200px 1fr", lg: "300px 1fr" });
  const cardColumns = useBreakpointValue({ base: 2, sm: 2, md: 3, lg: 4 });
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filter section component
  const FilterSection = () => (
    <VStack align="stretch" spacing={4}>
      <CategoryDropdown 
        title={categoryName}
        items={subCategories || []}
        selectedItemId={selectedCategory?.id}
        onItemClick={handleItemClick}
      />
      {selectedCategory && (
        <DynamicFilters
          subCategoryId={selectedCategory.id}
          filters={filters}
          setFilters={handleFilterChange}
          hideBrandFilter={selectedCategory.id === 18}
        />
      )}
    </VStack>
  );

  return (
    <Box className='py-4 w-[95%] mx-auto'>
      {isMobile && (
        <Box mb={4}>
          <IconButton
            aria-label="Open filters"
            icon={<Filter />}
            onClick={onOpen}
          />
        </Box>
      )}
      
      <Grid templateColumns={columns} gap={[3, 4, 6]}>
        {!isMobile && (
          <GridItem>
            <Box position="sticky" top="20px">
              <FilterSection />
            </Box>
          </GridItem>
        )}
        <GridItem>
          {isLoadingSubCategories || isLoadingAdsData ? (
            <Box>
              <Skeleton height="40px" mb={4} />
              <SimpleGrid columns={cardColumns} spacing={[3, 4, 6]}>
                {[...Array(cardColumns * 3)].map((_, i) => (
                  <Box key={i}>
                    <SkeletonCircle size="80px" mb={2} />
                    <SkeletonText noOfLines={2} mb={2} />
                    <Skeleton height="20px" width="80%" mb={2} />
                    <Skeleton height="20px" width="60%" />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ) : (
            <>
              <Box className='flex justify-between mb-4'>
                <Text fontSize={["lg", "xl"]} fontWeight="bold">
                  {selectedCategory?.name}
                </Text>
                <Select value={sortOption} onChange={handleSortChange} width="auto">
                  <option value="relevance">Sort by Relevance</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="postedDate">Posted Date</option>
                </Select>
              </Box>

              {filteredAndSortedAdsData().length > 0 ? (
                <SimpleGrid columns={cardColumns} spacing={[3, 4, 6]}>
                  {renderPaginatedAds(filteredAndSortedAdsData()).map((ad) => (
                    <CardUser
                      key={ad.id}
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
                  ))}
                </SimpleGrid>
              ) : (
                <Text fontSize={["sm", "md"]}>No ads available for this category.</Text>
              )}

              {filteredAndSortedAdsData().length > 16 && renderPagination(filteredAndSortedAdsData().length)}
            </>
          )}
        </GridItem>
      </Grid>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <FilterSection />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default CategoryBasedGrid;