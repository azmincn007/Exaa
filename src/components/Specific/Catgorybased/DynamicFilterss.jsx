import React, { useState, useEffect, useCallback } from "react";
import { VStack, Card, CardHeader, CardBody, Skeleton, Alert, AlertIcon, Button, Divider, Box, Heading, Flex } from "@chakra-ui/react";
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
import PriceRangeFilter from "./FiltersSingle/PriceRangeFilter";
import FloorNoFilter from "./FiltersSingle/FloorFilter";
import CarParkingFilter from "./FiltersSingle/CarparkingFIlter";
import RTOCodeFilter from "./FiltersSingle/RtoCOdefilter";
import BrandFilter from "./FiltersSingle/BrandFilter";
import TypeFilter from "./FiltersSingle/TypeFilter";
import ModelFilter from "./FiltersSingle/ModalFilter";
import MonthlyRentRangeFilter from "./FiltersSingle/MonthlyRentFilter";
import SecurityAmountRangeFilter from "./FiltersSingle/SecurityAmountFilter";
import PlotAreaRangeFilter from "./FiltersSingle/PlotareaFilter";
import SalaryFilter from "./FiltersSingle/SalaryFilter";
import PopularBrandsFilter from "./FiltersSingle/PopularBrandFIlter";

const DynamicFilters = ({ subCategoryId, onFilterChange, filters, setFilters, hideBrandFilter }) => {
  const getUserToken = useCallback(() => localStorage.getItem("UserToken"), []);

  const [filterConfig, setFilterConfig] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);

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

        let { filterKeys } = response.data.data;
        if (subCategoryId === 11) {
          filterKeys.push("popularBrands");
        }

        // Move "popularBrands" to the front if it exists
        filterKeys = filterKeys.filter(key => key !== "popularBrands");
        filterKeys.unshift("popularBrands");

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
    setLocalFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [key]: value,
      };

      // If the brand filter is changed, update selectedBrands
      if (key === 'brand') {
        setSelectedBrands(value);
      }

      // Synchronize popularBrands and brand selections
      if (key === 'popularBrands') {
        const updatedBrands = new Set([...value, ...updatedFilters['brand']]);
        updatedFilters['brand'] = Array.from(updatedBrands);
        setSelectedBrands(updatedFilters['brand']);
      } else if (key === 'brand') {
        const updatedPopularBrands = new Set([...value, ...updatedFilters['popularBrands']]);
        updatedFilters['popularBrands'] = Array.from(updatedPopularBrands);
      }

      // Update popularBrands when a brand is unchecked
      if (key === 'brand' && value.length < prev[key].length) {
        const uncheckedBrand = prev[key].find(brand => !value.includes(brand));
        if (uncheckedBrand) {
          updatedFilters['popularBrands'] = updatedFilters['popularBrands'].filter(brand => brand !== uncheckedBrand);
        }
      }

      // Update brand when a popular brand is unchecked
      if (key === 'popularBrands' && value.length < prev[key].length) {
        const uncheckedPopularBrand = prev[key].find(brand => !value.includes(brand));
        if (uncheckedPopularBrand) {
          updatedFilters['brand'] = updatedFilters['brand'].filter(brand => brand !== uncheckedPopularBrand);
        }
      }

      return updatedFilters;
    });
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
    setSelectedBrands([]);
  };

  const renderFilter = (filterKey) => {
    // Always render "popular brands" filter for subcategory 11
    if (subCategoryId === 11 && filterKey === "popularBrands") {
      return <PopularBrandsFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} subCategoryId={subCategoryId} getUserToken={getUserToken}  subCategory={subCategoryId}/>;
    }

    // Skip rendering for 'salary' and 'variant' fields
    if (filterKey === "salary" || filterKey === "variant" || filterKey === "projectName" || filterKey === "length" || filterKey === "breadth") {
      return null;
    }

    // Add check for brand filter
    if (filterKey === "brand" && hideBrandFilter) {
      return null;
    }

    const rangeFilters = {
      totalLandArea: ["totalLandAreaStart", "totalLandAreaEnd"],
      superBuiltupArea: ["superBuiltupAreaStart", "superBuiltupAreaEnd"],
      carpetArea: ["carpetAreaStart", "carpetAreaEnd"],
      year: ["yearStart", "yearEnd"],
      buyYear: ["buyYearStart", "buyYearEnd"],
      price: ["priceStart", "priceEnd"],
      monthlyRent: ["monthlyRentStart", "monthlyRentEnd"],
      securityAmount: ["securityAmountStart", "securityAmountEnd"],
      plotArea: ["plotAreaStart", "plotAreaEnd"],
      salary: ["salaryStart", "salaryEnd"],
    };

    for (const [rangeKey, [startKey, endKey]] of Object.entries(rangeFilters)) {
      if (filterKey === startKey && filterConfig.includes(startKey) && filterConfig.includes(endKey)) {
        switch (rangeKey) {
          case "totalLandArea":
            return <LandAreaRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "superBuiltupArea":
            return <SuperBuiltupAreaFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "carpetArea":
            return <CarpetAreaFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "year":
            return <YearRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "buyYear":
            return <BuyYearRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
          case "price":
            return <PriceRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} subCategory={subCategoryId} />;
            case "monthlyRent":
  return <MonthlyRentRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
  case "securityAmount":
  return <SecurityAmountRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
  case "plotArea":
  return <PlotAreaRangeFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
  case "salary":
  return <SalaryFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
        }
      } else if (filterKey === endKey) {
        return null;
      }
    }

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
      case "floorNo":
        return <FloorNoFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "qualification":
        return <QualificationFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "experience":
        return <ExperienceFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "carParking":
        return <CarParkingFilter filterValues={localFilters} handleFilterChange={handleLocalFilterChange} />;
      case "rtoCode":
        return null;
      case "brand":
        return !hideBrandFilter ? (
          <BrandFilter 
            filterValues={localFilters} 
            handleFilterChange={handleLocalFilterChange} 
            subCategoryId={subCategoryId} 
            getUserToken={getUserToken} 
          />
        ) : null;
      case "model":
        // Only render ModelFilter if at least one brand is selected
        return selectedBrands.length > 0 ? (
          <ModelFilter 
            filterValues={localFilters} 
            handleFilterChange={handleLocalFilterChange} 
            subCategoryId={subCategoryId} 
            getUserToken={getUserToken}
            selectedBrands={selectedBrands}
          />
        ) : null;
      case "type":
        return (
          <TypeFilter 
            filterValues={localFilters} 
            handleFilterChange={handleLocalFilterChange} 
            subCategoryId={subCategoryId} 
            getUserToken={getUserToken} 
          />
        );
      case "maintenance":
        return null;
      case "typeOfAccomodation":
        return null;
        case "motorPower":
          return null;
      default:
        return <div>Unsupported filter type: {filterKey}</div>;
    }
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
                <Skeleton height="20px" width="50px" mb={2} />
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
    <Card className="h-full">
      <CardHeader position="sticky" top={0} bg="white" zIndex={1} borderBottom="1px" borderColor="gray.200">
        <Heading className="mb-4" size="md">Filters</Heading>
        <div className="flex flex-col gap-2 z-100" mb={4}>
            <Button className="z-10" colorScheme="blue" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button className="z-50" colorScheme="gray" variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
         
          <Divider borderColor="gray.300" />
          <Box overflowY="auto" css={scrollbarStyles}>
            {filterConfig.map((filterKey, index) => {
              const filterComponent = renderFilter(filterKey);
              if (filterComponent) {
                return (
                  <React.Fragment key={filterKey}>
                    {filterComponent}
                    {index < filterConfig.length - 1 && <Divider my={4} borderColor="gray.300" />}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default DynamicFilters;