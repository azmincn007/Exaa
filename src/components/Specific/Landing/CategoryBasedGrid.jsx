import React, { useContext, useEffect, useState } from 'react';
import {
  Box, VStack, Text, Grid, GridItem, SimpleGrid, useBreakpointValue, Select, Button, Drawer, 
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, 
  IconButton, Skeleton, SkeletonCircle, SkeletonText
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { TownContext } from '../../../App';
import { Filter } from 'lucide-react'; 
import CategoryDropdown from '../Catgorybased/CategoryDropdown';
import DynamicFilters from '../Catgorybased/DynamicFilterss';
import CardUser from '../../common/Cards/CardUser';
import AdsService from '../../../Services/AdsServices';

const CategoryBasedGrid = () => {
  const { categoryId, categoryName } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('relevance');
  const [visibleCount, setVisibleCount] = useState(16);
  const [selectedTown, selectedDistrict] = useContext(TownContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filters, setFilters] = useState({
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
  });

  // Fetch subcategories
  const { data: subCategories, isLoading: isLoadingSubCategories } = useQuery(
    ['subCategories', categoryId],
    () => AdsService.fetchSubCategories(categoryId),
    { enabled: !!categoryId }
  );

  useEffect(() => {
    if (subCategories && subCategories.length > 0) {
      setSelectedCategory(subCategories[0]);
    }
  }, [subCategories]);

  // Fetch ads data
  const { data: adsData, isLoading: isLoadingAdsData, refetch: refetchAdsData } = useQuery(
    ['adsData', selectedCategory?.id, selectedTown, selectedDistrict, filters, sortOption],
    () => AdsService.fetchAdsData({
      subCategoryId: selectedCategory?.id,
      selectedTownId: selectedTown || "all",
      selectedDistrictId: selectedDistrict || "all",
      filters,
      sortOption
    }),
    { 
      enabled: !!selectedCategory?.id,
      onSuccess: (data) => {
        console.log('useQuery adsData success:', data);
      },
      onError: (error) => {
        console.error('Error fetching adsData:', error);
      }
    }
  );

  const handleItemClick = (clickedItem) => {
    setSelectedCategory(clickedItem);
    setVisibleCount(16);
    if (isOpen) onClose();
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredAndSortedAdsData = () => {
    if (!adsData || !adsData.data) {
      return [];
    }
    
    const sorted = adsData.data.sort((a, b) => {
      switch (sortOption) {
        case 'priceLowToHigh': return a.price - b.price;
        case 'priceHighToLow': return b.price - a.price;
        case 'postedDate': return new Date(b.postedDate) - new Date(a.postedDate);
        case 'relevance':
        default: return 0;
      }
    });
    
    return sorted;
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 16);
  };

  const handleFilterChange = (newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
    refetchAdsData(); // Refetch data when filters change
  };

  const columns = useBreakpointValue({ base: "1fr", md: "250px 1fr" });
  const cardColumns = useBreakpointValue({ base: 2, sm: 2, md: 3 });
  const isMobile = useBreakpointValue({ base: true, md: false });

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
            <FilterSection />
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

              {filteredAndSortedAdsData().slice(0, visibleCount).length > 0 ? (
                <SimpleGrid columns={cardColumns} spacing={[3, 4, 6]}>
                  {filteredAndSortedAdsData().slice(0, visibleCount).map((ad) => {
                    return (
                      <CardUser
                        key={ad.id}
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
                    );
                  })}
                </SimpleGrid>
              ) : (
                <Text fontSize={["sm", "md"]}>No ads available for this category.</Text>
              )}

              {filteredAndSortedAdsData().length > visibleCount && (
                <Box className='w-full flex justify-center mt-4'>
                  <Button colorScheme='blue' onClick={handleShowMore}>
                    Show More
                  </Button>
                </Box>
              )}
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