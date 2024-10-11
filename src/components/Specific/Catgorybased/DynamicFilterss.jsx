import React, { useState, useEffect, useCallback } from "react";
import { VStack, Card, CardHeader, CardBody, Skeleton, Alert, AlertIcon, Button, Divider, Box, Heading } from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../../config/config";
import FuelFilter from "./FiltersSingle/FuelFIlter";
import YearFilter from "./FiltersSingle/YearFilter";
import TransmissionFilter from "./FiltersSingle/TransmissionFIlter";
import KmDrivenFilter from "./FiltersSingle/KmDrivenFilter";
import NoOfOwnersFilter from "./FiltersSingle/NoOwners";
import BedroomFilter from "./FiltersSingle/BedroomFilter";
import BathroomFilter from "./FiltersSingle/BathroomFilter";
import FurnishingFilter from "./FiltersSingle/FurnishingFilter";
import ConstructionStatusFilter from "./FiltersSingle/ConstructionStatusFilter";
import ListedByFilter from "./FiltersSingle/ListedByFilter";
import TotalFloorsFilter from "./FiltersSingle/TotalFloorsFilter";
import FacingFilter from "./FiltersSingle/FacingFilter";
import LandAreaRangeFilter from "./FiltersSingle/LandAreaFilter";
import SuperBuiltupAreaFilter from "./FiltersSingle/SuperBuiltupAreaFilter";
import CarpetAreaFilter from "./FiltersSingle/CarperAreaFilter";
import YearRangeFilter from "./FiltersSingle/YearRangeFilter";
import EngineCCFilter from "./FiltersSingle/EngineCC";
import BuyYearRangeFilter from "./FiltersSingle/Buyyearrangefilter";
import SalaryPeriodFilter from "./FiltersSingle/SalaryPEriodFIlter";
import PositionTypeFilter from "./FiltersSingle/PositionTypeFIlter";
import QualificationFilter from "./FiltersSingle/QualificationFilter";
import ExperienceFilter from "./FiltersSingle/ExperienceFilter";

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
          throw new Error("Invalid response format from API");
        }

        const { filterKeys } = response.data.data;
        setFilterConfig(filterKeys);

        if (filterKeys.length > 0) {
          const newInitialFilters = {};
          filterKeys.forEach((key) => {
            newInitialFilters[key] = filters[key] || [];
          });
          setLocalFilters(newInitialFilters);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch filter configuration");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterConfig();
  }, [subCategoryId, filters]);

  const handleLocalFilterChange = useCallback((key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApplyFilters = () => {
    const updatedFilters = { ...filters, ...localFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    Object.keys(localFilters).forEach((key) => {
      resetFilters[key] = Array.isArray(filters[key]) ? [] : null;
    });
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const renderFilter = (filterKey) => {
    const rangeFilters = {
      totalLandArea: ['totalLandAreaStart', 'totalLandAreaEnd'],
      superBuiltupArea: ['superBuiltupAreaStart', 'superBuiltupAreaEnd'],
      carpetArea: ['carpetAreaStart', 'carpetAreaEnd'],
      year: ['yearStart', 'yearEnd'],
      buyYear: ['buyYearStart', 'buyYearEnd']
    };

    for (const [rangeKey, [startKey, endKey]] of Object.entries(rangeFilters)) {
      if (filterKey === startKey && filterConfig.includes(startKey) && filterConfig.includes(endKey)) {
        switch (rangeKey) {
          case 'totalLandArea':
            return <LandAreaRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case 'superBuiltupArea':
            return <SuperBuiltupAreaFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case 'carpetArea':
            return <CarpetAreaFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case 'year':
            return <YearRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case 'buyYear':
            return <BuyYearRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
            
        }
      } else if (filterKey === endKey) {
        return null;
      }
    }
    // Handle other filters
    switch (filterKey) {
      case "fuel":
        return <FuelFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "year":
        return <YearFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "transmission":
        return <TransmissionFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "kmDriven":
        return <KmDrivenFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "noOfOwners":
        return <NoOfOwnersFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "bedrooms":
        return <BedroomFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "bathrooms":
        return <BathroomFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "furnishing":
        return <FurnishingFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "constructionStatus":
        return <ConstructionStatusFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "listedBy":
        return <ListedByFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "totalFloors":
        return <TotalFloorsFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "facing":
        return <FacingFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        case "engineCC":
          return <EngineCCFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "salaryPeriod":
            return <SalaryPeriodFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "positionType":
            return <PositionTypeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "qualification":
            return <QualificationFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "experience":
            return <ExperienceFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      default:
        return <div>Unsupported filter type: {filterKey}</div>;
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
            {[1, 2, 3].map((i) => (
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
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-track": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "24px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    scrollbarWidth: "thin",
    scrollbarColor: "black transparent",
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Filters</Heading>
      </CardHeader>
      <CardBody>
        <Box maxHeight="600px" overflowY="auto" css={scrollbarStyles}>
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
