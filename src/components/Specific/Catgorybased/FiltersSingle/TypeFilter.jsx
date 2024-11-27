import { Alert, Box, Checkbox, CheckboxGroup, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useTypes } from "../../../common/config/Api/UseTypes";

const TypeFilter = ({ filterValues, handleFilterChange, subCategoryId, getUserToken }) => {
    const { data: types, isLoading, error } = useTypes(true, getUserToken, subCategoryId);
  
    if (isLoading) return <Skeleton height="20px" />;
    if (error) return <Alert status="error"><AlertIcon />{error.message}hii</Alert>;
  
    return (
      <Box>
        <Text className="font-semibold" size="sm" mb={2}>Type</Text>
        <CheckboxGroup
          colorScheme="blue"
          value={filterValues.type || []}
          onChange={(values) => handleFilterChange("type", values)}
        >
          <Stack spacing={2} direction="column">
            {types.map((type) => (
              <Checkbox key={type.id} value={type.id.toString()}>
                {type.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>
    );
  };

  export default TypeFilter