import React from 'react';
import { Checkbox, CheckboxGroup, VStack, Text, Skeleton, Alert, AlertIcon } from '@chakra-ui/react';
import { useBrands } from '../../../common/config/Api/UseBrands';
import { BASE_URL } from '../../../../config/config';


const PopularBrandsFilter = ({ filterValues, handleFilterChange, subCategoryId, getUserToken }) => {
    const { data: brands, isLoading, error } = useBrands(true, getUserToken, subCategoryId);
  console.log(subCategoryId);
  if (isLoading) return <Skeleton height="20px" />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  const handleBoxClick = (brandId) => {
    const selectedBrands = filterValues.popularBrands || [];
    if (selectedBrands.includes(brandId)) {
        handleFilterChange('popularBrands', selectedBrands.filter(id => id !== brandId));
    } else {
        handleFilterChange('popularBrands', [...selectedBrands, brandId]);
    }
  };

  return (
    <VStack align="start">
      <Text size="md" fontWeight="semibold">Popular Brands</Text>
      <VStack spacing={2} align="start" width="100%">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {(brands || []).slice(0, 6).map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBoxClick(brand.id.toString())}
              style={{
                width: '30%', // Adjust width for 3 boxes per line
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: filterValues.popularBrands?.includes(brand.id.toString()) ? 'lightblue' : 'white',
                borderRadius: '5px',
                textAlign: 'center'
              }}
            >
              <img src={`${BASE_URL}${brand.logo.url}`} alt={brand.name} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          ))}
        </div>
      </VStack>
    </VStack>
  );
};

export default PopularBrandsFilter;