import React, { useState, useEffect, useCallback } from 'react';
import {
  VStack,
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  Alert,
  AlertIcon,
  Button,
  Divider,
  Box,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import FuelFilter from './FiltersSingle/FuelFIlter';
import YearFilter from './FiltersSingle/YearFilter';
import TransmissionFilter from './FiltersSingle/TransmissionFIlter';
import KmDrivenFilter from './FiltersSingle/KmDrivenFilter';
import NoOfOwnersFilter from './FiltersSingle/NoOwners';

const DynamicFilters = ({ subCategoryId, onFilterChange, filters, setFilters }) => {
  const [filterConfig, setFilterConfig] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilterConfig = async () => {
      if (!subCategoryId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${subCategoryId}`);

        if (!response.data || !response.data.data || !Array.isArray(response.data.data.filterKeys)) {
          throw new Error('Invalid response format from API');
        }

        const { filterKeys } = response.data.data;
        setFilterConfig(filterKeys);

        if (filterKeys.length > 0) {
          const newInitialFilters = {};
          filterKeys.forEach(key => {
            newInitialFilters[key] = filters[key] || [];
          });
          setLocalFilters(newInitialFilters);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch filter configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterConfig();
  }, [subCategoryId, filters]);

  const handleLocalFilterChange = useCallback((key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    Object.keys(localFilters).forEach(key => {
      resetFilters[key] = [];
    });
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const renderFilter = (filterKey) => {
    let filterComponent;
    switch (filterKey) {
      case 'fuel':
        filterComponent = <FuelFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        break;
      case 'year':
        filterComponent = <YearFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        break;
      case 'transmission':
        filterComponent = <TransmissionFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        break;
      case 'kmDriven':
        filterComponent = <KmDrivenFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        break;
      case 'noOfOwners':
        filterComponent = <NoOfOwnersFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        break;
      default:
        filterComponent = <div>Unsupported filter type: {filterKey}</div>;
    }

    return (
      <Box key={filterKey} width="100%" p={2}>
        {filterComponent}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton height="24px" width="100px" />
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            {[1, 2, 3].map(i => (
              <Box key={i} width="100%">
                <Skeleton height="20px" width="150px" mb={2} />
                <Skeleton height="40px" />
                {i < 3 && <Divider my={4} borderColor="gray.300" />}
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!filterConfig || filterConfig.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        No filters available for this category
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Filters</Heading>
      </CardHeader>
      <CardBody>
        <Box maxHeight="400px" overflowY="auto">
          <VStack spacing={4} align="stretch">
            {filterConfig.map((filterKey, index) => (
              <React.Fragment key={filterKey}>
                {renderFilter(filterKey)}
                {index < filterConfig.length - 1 && <Divider my={4} borderColor="gray.300" />}
              </React.Fragment>
            ))}
            <Divider my={4} borderColor="gray.300" />
            <Button colorScheme="blue" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button colorScheme="gray" variant="outline" onClick={handleResetFilters} mt={2}>
              Reset Filters
            </Button>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default DynamicFilters;
