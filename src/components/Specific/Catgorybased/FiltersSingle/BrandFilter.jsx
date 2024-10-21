import { Alert, AlertIcon, Box, Checkbox, CheckboxGroup, Heading, Skeleton, Stack } from "@chakra-ui/react";
import { useBrands } from "../../../common/config/Api/UseBrands";

const BrandFilter = ({ filterValues, handleFilterChange, subCategoryId, getUserToken }) => {
    const { data: brands, isLoading, error } = useBrands(true, getUserToken, subCategoryId);
  
    if (isLoading) return <Skeleton height="20px" />;
    if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;
  
    return (
      <Box maxH="200px" className="overflow-y-scroll">
        <Heading size="sm" mb={2}>Brand</Heading>
        <CheckboxGroup
          colorScheme="blue"
          value={filterValues.brand || []}
          onChange={(values) => handleFilterChange("brand", values)}
        >
          <Stack spacing={2} direction="column">
            {brands.map((brand) => (
              <Checkbox key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>
    );
  };

  export default BrandFilter